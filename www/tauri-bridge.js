(function () {
  "use strict";

  // Tauri 2 injects window.__TAURI__ synchronously before page scripts execute
  // (requires withGlobalTauri: true in tauri.conf.json).
  // This shim maps window.electronAPI to Tauri invoke calls so app.js is unchanged.

  if (!window.__TAURI__) return;

  const invoke = window.__TAURI__.core.invoke;

  window.electronAPI = {
    getAppVersion: () => invoke("get_app_version"),
    setWindowTitle: (title) => invoke("set_title", { title }),
    openExternal: (url) => invoke("open_external", { url }),
    quitApp: () => invoke("quit_app"),
    getViceConfig: () => invoke("get_vice_config"),
    getExomizerConfig: () => invoke("get_exomizer_config"),
    getUiSettings: () => invoke("get_ui_settings"),
    saveUiSettingsGlobal: (settings) => invoke("save_ui_settings", { settings }),
    chooseViceExecutable: () => invoke("choose_vice_executable"),
    chooseExomizerExecutable: () => invoke("choose_exomizer_executable"),
    buildExomizerPrg: (payload) => invoke("build_exomizer_prg", { payload }),
    buildExomizerRaw: (payload) => invoke("build_exomizer_raw", { payload }),
    launchVice: (payload) => invoke("launch_vice", { payload }),
    launchExomizer: (payload) => invoke("launch_exomizer", { payload }),
    getDebuggerConfig: () => invoke("get_debugger_config"),
    chooseDebuggerExecutable: () => invoke("choose_debugger_executable"),
    launchDebugger: (payload) => invoke("launch_debugger", { payload }),
    chooseIncBinFile: () => invoke("choose_incbin_file"),
    loadIncBinSampleFile: (fileName) => invoke("load_incbin_sample", { fileName }),
    reloadIncBinFile: (filePath, baseDir) => invoke("reload_incbin_file", { filePath, baseDir }),
    chooseSidFile: () => invoke("choose_sid_file"),
    loadSidSampleFile: (fileName) => invoke("load_sid_sample", { fileName }),
    reloadSidFile: (filePath, baseDir) => invoke("reload_sid_file", { filePath, baseDir }),
    chooseIncludeFile: () => invoke("choose_include_file"),
    reloadIncludeFile: (filePath, baseDir) => invoke("reload_include_file", { filePath, baseDir }),
    savePrg: (payload) => invoke("save_prg", { payload }),
    saveBin: (payload) => invoke("save_bin", { payload }),
    saveD64: (payload) => invoke("save_d64", { payload }),
    runD64: (payload) => invoke("run_d64", { payload }),
    saveProject: (payload) => invoke("save_project", { payload }),
    loadProject: () => invoke("load_project"),
    openProjFile: () => invoke("open_proj_file"),
    saveProjFile: (path, content) => invoke("save_proj_file", { path, content }),
    readTextFile: (path) => invoke("read_text_file", { path }),
    saveTextFile: (path, content) => invoke("save_text_file", { path, content }),
    getProjectSnapshotPath: (projectPath, snapshotId) => invoke("get_project_snapshot_path", { projectPath, snapshotId }),
    saveAsmFile: (path, content) => invoke("save_asm_file", { path, content }),
    chooseAsmFile: () => invoke("choose_asm_file"),
    chooseProjMember: () => invoke("choose_proj_member"),
    readBinFile: (path) => invoke("read_bin_file", { path }),
    loadSample: (sampleName) => invoke("load_sample", { sampleName }),
    openManual: () => invoke("open_manual"),
    runOnUltimate: (host, password, prgBytes) => invoke("run_on_ultimate", { host, password, prgBytes }),
    runD64OnUltimate: (payload) => invoke("run_d64_on_ultimate", { payload }),
    testUltimateConnection: (host, password) => invoke("test_ultimate_connection", { host, password }),
    runInBrowserEmulator: (prgB64) => invoke("run_in_browser_emulator", { prgB64 }),
    runD64InBrowserEmulator: (payload) => invoke("run_d64_in_browser_emulator", { payload }),
  };
})();
