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
    chooseViceExecutable: () => invoke("choose_vice_executable"),
    launchVice: (payload) => invoke("launch_vice", { payload }),
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
    saveProject: (payload) => invoke("save_project", { payload }),
    loadProject: () => invoke("load_project"),
    loadSample: (sampleName) => invoke("load_sample", { sampleName }),
    openManual: () => invoke("open_manual"),
  };
})();
