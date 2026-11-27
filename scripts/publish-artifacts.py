"""Publish extracted build artifacts and the release documents over explicit FTPS (TLS on port 21).

Installers of earlier versions stay on the server: downloads/VA/index.php and download.php offer
only the version released on the admin dashboard (register/release.php), so a new upload waits
there until it is released, and the released version has to remain available until then.
"""
import ftplib
import json
import os
from pathlib import Path, PurePosixPath
import re
import ssl
import sys
import tempfile
import urllib.request
import zipfile

BUILD_WORKFLOW = '.github/workflows/build.yml'
INSTALLERS = {'.exe', '.dmg', '.deb', '.rpm', '.appimage'}
# Repository path of every document; each is published under its file name.
DOCUMENTS = (
    'docs/Visual Assembler Manual.pdf',
    'docs/Visual Assembler Manual.hu.pdf',
    'docs/Oscar64 C Help.pdf',
    'README.txt',
    'install.txt',
)
# UltimateBasic documents (its main branch); the product site links them as downloads/VA/<name>.
UB_DOCUMENTS = (
    'MANUAL.pdf',
    'whatnews.txt',
)
SAMPLES = 'samples'
SAMPLES_ZIP = 'va-samples.zip'
VERSION = re.compile(r'(?<![\d.])\d+\.\d+\.\d+(?![\d.])')


def validate_run():
    run_id = os.environ['BUILD_RUN_ID']
    if not run_id.isascii() or not run_id.isdecimal():
        raise ValueError('Build run ID must be a positive integer.')
    repository = os.environ['GH_REPOSITORY']
    request = urllib.request.Request(
        f'https://api.github.com/repos/{repository}/actions/runs/{run_id}',
        headers={'Authorization': 'Bearer ' + os.environ['GH_TOKEN'],
                 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28'},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        run = json.load(response)
    if run.get('path', '').split('@')[0] != BUILD_WORKFLOW:
        raise ValueError('The selected run is not a Release run.')
    if run.get('status') != 'completed' or run.get('conclusion') != 'success':
        raise ValueError('The selected build must have completed successfully.')
    sha = run['head_sha']
    if len(sha) != 40 or any(c not in '0123456789abcdef' for c in sha):
        raise ValueError('Invalid source build commit.')
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as output:
            output.write(f'head_sha={sha}\n')
    print(f'Validated build {run_id}, commit {sha}.')


def check_file(path):
    if path.is_symlink():
        raise ValueError('Symlinks are not supported.')
    if '\r' in path.name or '\n' in path.name or path.stat().st_size == 0:
        raise ValueError(f'Invalid or empty file: {path.name}')


def collect_installers(root):
    files = {}
    for path in sorted(Path(root).rglob('*')):
        if path.is_symlink():
            raise ValueError('Symlinks are not supported.')
        if not path.is_file() or path.suffix.lower() not in INSTALLERS:
            continue
        if path.name in files:
            raise ValueError(f'Duplicate output filename: {path.name}')
        check_file(path)
        files[path.name] = path
    if not files:
        # A push or pull request run only tests; installers come from a manual run.
        raise ValueError('No installers in that run: choose a manual (Run workflow) Release run.')
    versions = {match.group(0) for match in (VERSION.search(name) for name in files) if match}
    if len(versions) != 1 or any(not VERSION.search(name) for name in files):
        raise ValueError('The installers must all carry one release version.')
    return files


def collect_documents(source, documents=DOCUMENTS, origin='The source build commit'):
    files = {}
    for document in documents:
        path = Path(source) / document
        if path.is_symlink() or not path.is_file():
            raise ValueError(f'{origin} has no {document}.')
        check_file(path)
        if path.suffix.lower() == '.pdf':
            with path.open('rb') as content:
                if content.read(5) != b'%PDF-':
                    raise ValueError(f'{document} is not a PDF.')
        files[path.name] = path
    return files


def build_samples_zip(source, target):
    """Pack the samples folder of the build's commit; inside the archive the paths start with samples/."""
    folder = Path(source) / SAMPLES
    if folder.is_symlink() or not folder.is_dir():
        raise ValueError(f'The source build commit has no {SAMPLES} folder.')
    paths = sorted(folder.rglob('*'))
    if any(path.is_symlink() for path in paths):
        raise ValueError('Symlinks are not supported.')
    files = [path for path in paths if path.is_file()]
    if not files:
        raise ValueError(f'The {SAMPLES} folder of the source build commit is empty.')
    archive = Path(target) / SAMPLES_ZIP
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as output:
        for path in files:
            output.write(path, path.relative_to(source).as_posix())
    return archive


def safe_error(error):
    message = str(error)
    for key in ('FTP_PASSWORD', 'GH_TOKEN'):
        secret = os.environ.get(key)
        if secret:
            message = message.replace(secret, '[REDACTED]')
    return ' '.join(message.splitlines())[:600]


def upload(root, source, ub_source):
    with tempfile.TemporaryDirectory() as temp:
        upload_files(root, source, ub_source, build_samples_zip(source, temp))


def upload_files(root, source, ub_source, samples_zip):
    # The documents and the samples go last: they are public at once, so only after every installer has arrived.
    documents = collect_documents(source)
    ub_documents = collect_documents(ub_source, UB_DOCUMENTS, 'The UltimateBasic checkout')
    clash = documents.keys() & ub_documents.keys()
    if clash:
        raise ValueError(f'Document name used twice: {", ".join(sorted(clash))}')
    files = {**collect_installers(root), **documents, **ub_documents, samples_zip.name: samples_zip}
    password = os.environ.get('FTP_PASSWORD', '')
    if not password:
        raise ValueError('Set the FTP_PASSWORD repository Actions secret before publishing.')
    directory = PurePosixPath(os.environ['FTP_DIRECTORY'])
    if not directory.is_absolute() or '..' in directory.parts:
        raise ValueError('FTP_DIRECTORY must be an absolute directory without parent traversal.')
    stage = 'opening FTPS connection'
    try:
        # Validate the server certificate and encrypt both login and data connections.
        with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=120) as ftp:
            stage = 'connecting to server'
            ftp.connect(os.environ['FTP_HOST'], 21)
            stage = 'login (check the FTP_PASSWORD Actions secret if rejected)'
            ftp.login(os.environ['FTP_USERNAME'], password)
            stage = 'enabling encrypted data transfers'
            ftp.prot_p()
            ftp.set_pasv(True)
            stage = f'opening target directory {directory}'
            ftp.cwd(str(directory))
            for name, path in files.items():
                stage = f'uploading {name}'
                print(f'Uploading {name} ({path.stat().st_size} bytes)', flush=True)
                with path.open('rb') as content:
                    ftp.storbinary('STOR ' + name, content, blocksize=256 * 1024)
                stage = f'verifying uploaded size of {name}'
                ftp.voidcmd('TYPE I')
                if ftp.size(name) != path.stat().st_size:
                    raise ValueError(f'Remote size verification failed: {name}')
    except (ftplib.Error, OSError, EOFError) as error:
        raise ValueError(f'FTP {stage}: {safe_error(error)}') from None
    print(f'Published {len(files)} files. Existing files were retained.')


if __name__ == '__main__':
    try:
        if sys.argv[1:] == ['--validate-run']:
            validate_run()
        elif len(sys.argv) == 4:
            upload(sys.argv[1], sys.argv[2], sys.argv[3])
        else:
            raise ValueError('Usage: publish-artifacts.py ARTIFACT_DIRECTORY SOURCE_DIRECTORY UB_DIRECTORY | --validate-run')
    except Exception as error:
        # FTP errors can contain server responses: never print login details.
        if isinstance(error, ValueError):
            print(f'Publish failed: {error}', file=sys.stderr)
        else:
            print(f'Publish failed ({type(error).__name__}). Check the connection and source build.', file=sys.stderr)
        sys.exit(1)
