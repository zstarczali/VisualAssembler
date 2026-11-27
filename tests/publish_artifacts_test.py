import importlib.util
import io
import os
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import MagicMock, patch
import zipfile

sys.dont_write_bytecode = True

spec = importlib.util.spec_from_file_location('publish', Path(__file__).parents[1] / 'scripts/publish-artifacts.py')
publish = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publish)

EXE = 'C64 Visual Assembler_2.7.5_x64-setup.exe'
DMG = 'C64 Visual Assembler_2.7.5_aarch64.dmg'
IMAGE = 'C64 Visual Assembler_2.7.5_amd64.AppImage'
DEB = 'c64-visual-assembler_2.7.5_amd64.deb'
RPM = 'C64 Visual Assembler-2.7.5-1.x86_64.rpm'
DOCS = {'Visual Assembler Manual.pdf', 'Visual Assembler Manual.hu.pdf', 'Oscar64 C Help.pdf', 'README.txt', 'install.txt',
        'MANUAL.pdf', 'whatnews.txt'}
ENV = {'FTP_HOST': 'example.test', 'FTP_USERNAME': 'test', 'FTP_PASSWORD': 'test-password', 'FTP_DIRECTORY': '/www/downloads/VA/'}


class PublishTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name) / 'artifacts'
        self.source = Path(temp.name) / 'source'
        self.ub = Path(temp.name) / 'ub-docs'
        self.root.mkdir()
        for folder, documents in ((self.source, publish.DOCUMENTS), (self.ub, publish.UB_DOCUMENTS)):
            for document in documents:
                path = folder / document
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b'%PDF-1.7 manual' if document.endswith('.pdf') else b'text')
        for sample in ('samples/demo.asm', 'samples/Kick/nested.asm', 'samples/empty.bin'):
            path = self.source / sample
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b'' if sample.endswith('.bin') else b'; sample')

    def artifact(self, name, content=b'artifact'):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        return path

    def publish_with(self, ftp):
        with patch.dict(os.environ, ENV), patch.object(publish.ftplib, 'FTP_TLS') as cls:
            cls.return_value.__enter__.return_value = ftp
            publish.upload(self.root, self.source, self.ub)
        return cls

    def good_ftp(self):
        ftp = MagicMock()
        stored = {}

        def store(command, content, blocksize=None):
            stored[command[len('STOR '):]] = content.read()

        ftp.storbinary.side_effect = store
        ftp.size.side_effect = lambda name: len(stored[name])
        ftp.stored = stored
        return ftp

    def test_collects_every_installer_kind_without_zip_wrappers(self):
        for folder, name in [('windows-x64', EXE), ('macos-arm64', DMG), ('linux-x64', IMAGE), ('linux-x64', DEB), ('linux-x64', RPM)]:
            self.artifact(f'{folder}/{name}')
        self.artifact('linux-x64/ignored.zip')
        self.assertEqual(set(publish.collect_installers(self.root)), {EXE, DMG, IMAGE, DEB, RPM})

    def test_run_without_installers_is_refused_before_connecting(self):
        with patch.dict(os.environ, ENV), patch.object(publish.ftplib, 'FTP_TLS') as ftp:
            with self.assertRaisesRegex(ValueError, 'No installers'):
                publish.upload(self.root, self.source, self.ub)
            ftp.assert_not_called()

    def test_rejects_duplicate_names(self):
        self.artifact(f'a/{EXE}')
        self.artifact(f'b/{EXE}')
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            publish.collect_installers(self.root)

    def test_rejects_mixed_or_missing_versions(self):
        self.artifact(EXE)
        self.artifact('C64 Visual Assembler_2.7.4_aarch64.dmg')
        with self.assertRaisesRegex(ValueError, 'one release version'):
            publish.collect_installers(self.root)
        (self.root / 'C64 Visual Assembler_2.7.4_aarch64.dmg').unlink()
        self.artifact('nameless.dmg')
        with self.assertRaisesRegex(ValueError, 'one release version'):
            publish.collect_installers(self.root)

    def test_all_documents_are_required_before_connecting(self):
        self.artifact(EXE)
        for document in publish.DOCUMENTS:
            path = self.source / document
            kept = path.read_bytes()
            path.unlink()
            with patch.dict(os.environ, ENV), patch.object(publish.ftplib, 'FTP_TLS') as ftp:
                with self.assertRaisesRegex(ValueError, 'has no'):
                    publish.upload(self.root, self.source, self.ub)
                ftp.assert_not_called()
            path.write_bytes(kept)

    def test_the_ultimatebasic_documents_are_required_before_connecting(self):
        self.artifact(EXE)
        for document in publish.UB_DOCUMENTS:
            path = self.ub / document
            kept = path.read_bytes()
            path.unlink()
            with patch.dict(os.environ, ENV), patch.object(publish.ftplib, 'FTP_TLS') as ftp:
                with self.assertRaisesRegex(ValueError, 'UltimateBasic checkout has no'):
                    publish.upload(self.root, self.source, self.ub)
                ftp.assert_not_called()
            path.write_bytes(kept)

    def test_the_ultimatebasic_manual_must_be_a_pdf(self):
        (self.ub / 'MANUAL.pdf').write_bytes(b'<html>')
        with self.assertRaisesRegex(ValueError, 'MANUAL.pdf is not a PDF'):
            publish.collect_documents(self.ub, publish.UB_DOCUMENTS, 'The UltimateBasic checkout')

    def test_rejects_a_manual_that_is_not_a_pdf_and_an_empty_document(self):
        pdf = self.source / 'docs/Visual Assembler Manual.hu.pdf'
        pdf.write_bytes(b'version https://git-lfs')
        with self.assertRaisesRegex(ValueError, 'not a PDF'):
            publish.collect_documents(self.source)
        pdf.write_bytes(b'%PDF-1.7')
        (self.source / 'install.txt').write_bytes(b'')
        with self.assertRaisesRegex(ValueError, 'empty'):
            publish.collect_documents(self.source)

    def test_uploads_to_the_va_folder_over_tls_documents_last(self):
        self.artifact(f'windows-x64/{EXE}')
        ftp = self.good_ftp()
        cls = self.publish_with(ftp)
        self.assertTrue(cls.call_args.kwargs['context'].check_hostname)
        ftp.connect.assert_called_once_with('example.test', 21)
        ftp.prot_p.assert_called_once()
        ftp.cwd.assert_called_once_with('/www/downloads/VA')
        stored = [c.args[0][len('STOR '):] for c in ftp.storbinary.call_args_list]
        self.assertEqual(stored[0], EXE)
        self.assertEqual(set(stored[1:]), DOCS | {'va-samples.zip'})
        self.assertEqual(ftp.size.call_count, 1 + len(DOCS) + 1)

    def test_the_samples_folder_is_uploaded_as_a_zip_with_its_subfolders(self):
        self.artifact(f'windows-x64/{EXE}')
        ftp = self.good_ftp()
        self.publish_with(ftp)
        with zipfile.ZipFile(io.BytesIO(ftp.stored['va-samples.zip'])) as archive:
            self.assertIsNone(archive.testzip())
            self.assertEqual(set(archive.namelist()), {'samples/demo.asm', 'samples/Kick/nested.asm', 'samples/empty.bin'})
            self.assertEqual(archive.read('samples/Kick/nested.asm'), b'; sample')
            self.assertEqual(archive.getinfo('samples/demo.asm').compress_type, zipfile.ZIP_DEFLATED)

    def test_missing_or_empty_samples_are_refused_before_connecting(self):
        self.artifact(EXE)
        shutil.rmtree(self.source / 'samples')
        with patch.dict(os.environ, ENV), patch.object(publish.ftplib, 'FTP_TLS') as ftp:
            with self.assertRaisesRegex(ValueError, 'no samples folder'):
                publish.upload(self.root, self.source, self.ub)
            (self.source / 'samples').mkdir()
            with self.assertRaisesRegex(ValueError, 'is empty'):
                publish.upload(self.root, self.source, self.ub)
            ftp.assert_not_called()

    def test_never_removes_anything_the_released_version_still_needs_it(self):
        self.artifact(f'windows-x64/{EXE}')
        ftp = self.good_ftp()
        ftp.nlst.return_value = ['C64 Visual Assembler_2.7.4_x64-setup.exe']
        self.publish_with(ftp)
        ftp.delete.assert_not_called()
        ftp.nlst.assert_not_called()

    def test_size_mismatch_stops_the_upload_before_the_documents(self):
        self.artifact(f'windows-x64/{EXE}')
        ftp = MagicMock()
        ftp.size.return_value = 0
        with self.assertRaisesRegex(ValueError, 'size verification failed'):
            self.publish_with(ftp)
        self.assertEqual(ftp.storbinary.call_count, 1)

    def test_rejects_failed_or_unrelated_builds(self):
        with patch.dict(os.environ, {'BUILD_RUN_ID': '123', 'GH_REPOSITORY': 'owner/repo', 'GH_TOKEN': 'test-only'}), patch.object(publish.urllib.request, 'urlopen'):
            for run in [
                {'path': '.github/workflows/macos-icon.yml', 'status': 'completed', 'conclusion': 'success', 'head_sha': 'a' * 40},
                {'path': publish.BUILD_WORKFLOW, 'status': 'completed', 'conclusion': 'failure', 'head_sha': 'a' * 40},
                {'path': publish.BUILD_WORKFLOW, 'status': 'in_progress', 'conclusion': None, 'head_sha': 'a' * 40},
            ]:
                with patch.object(publish.json, 'load', return_value=run), self.assertRaises(ValueError):
                    publish.validate_run()

    def test_rejects_a_run_id_that_is_not_a_number(self):
        with patch.dict(os.environ, {'BUILD_RUN_ID': '1/../2', 'GH_REPOSITORY': 'owner/repo', 'GH_TOKEN': 'test-only'}), patch.object(publish.urllib.request, 'urlopen') as request:
            with self.assertRaisesRegex(ValueError, 'positive integer'):
                publish.validate_run()
            request.assert_not_called()

    def test_source_build_commit_is_passed_to_the_document_checkout(self):
        output = self.root / 'github-output'
        run = {'path': publish.BUILD_WORKFLOW, 'status': 'completed', 'conclusion': 'success', 'head_sha': 'a' * 40}
        env = {'BUILD_RUN_ID': '123', 'GH_REPOSITORY': 'owner/repo', 'GH_TOKEN': 'test-only', 'GITHUB_OUTPUT': str(output)}
        with patch.dict(os.environ, env), patch.object(publish.urllib.request, 'urlopen'), patch.object(publish.json, 'load', return_value=run):
            publish.validate_run()
        self.assertEqual(output.read_text(), 'head_sha=' + 'a' * 40 + '\n')

    def test_login_failure_reports_the_stage_without_the_password(self):
        self.artifact(EXE)
        ftp = MagicMock()
        ftp.login.side_effect = publish.ftplib.error_perm('530 Login rejected test-password')
        with self.assertRaises(ValueError) as caught:
            self.publish_with(ftp)
        self.assertIn('login', str(caught.exception))
        self.assertIn('530 Login rejected', str(caught.exception))
        self.assertNotIn('test-password', str(caught.exception))
        ftp.storbinary.assert_not_called()

    def test_upload_failure_reports_the_file_and_the_server_reply(self):
        self.artifact(EXE)
        ftp = MagicMock()
        ftp.storbinary.side_effect = publish.ftplib.error_perm('550 Permission denied')
        with self.assertRaisesRegex(ValueError, 'uploading .*550 Permission denied'):
            self.publish_with(ftp)

    def test_missing_target_folder_is_an_error_not_a_new_folder(self):
        self.artifact(EXE)
        ftp = MagicMock()
        ftp.cwd.side_effect = publish.ftplib.error_perm('550 No such directory')
        with self.assertRaisesRegex(ValueError, 'target directory'):
            self.publish_with(ftp)
        ftp.mkd.assert_not_called()


if __name__ == '__main__':
    unittest.main()
