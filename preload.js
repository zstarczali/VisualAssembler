const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setWindowTitle: (title) => ipcRenderer.invoke("window:set-title", title),
  openExternal: (url) => ipcRenderer.invoke("shell:open-external", url),
  quitApp: () => ipcRenderer.invoke("app:quit"),
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  getViceConfig: () => ipcRenderer.invoke("vice:get-config"),
  chooseViceExecutable: () => ipcRenderer.invoke("vice:choose-executable"),
  launchVice: (payload) => ipcRenderer.invoke("vice:launch", payload),
  chooseIncBinFile: () => ipcRenderer.invoke("incbin:choose-file"),
  loadIncBinSampleFile: (fileName) => ipcRenderer.invoke("incbin:load-sample-file", fileName),
  chooseIncludeFile: () => ipcRenderer.invoke("include:choose-file"),
  reloadIncludeFile: (filePath) => ipcRenderer.invoke("include:reload-file", filePath),
  savePrg: (payload) => ipcRenderer.invoke("prg:save", payload),
  saveProject: (payload) => ipcRenderer.invoke("project:save", payload),
  loadProject: () => ipcRenderer.invoke("project:load"),
  loadSample: (sampleName) => ipcRenderer.invoke("sample:load", sampleName)
});
