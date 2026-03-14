const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  quitApp: () => ipcRenderer.invoke("app:quit"),
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  getViceConfig: () => ipcRenderer.invoke("vice:get-config"),
  chooseViceExecutable: () => ipcRenderer.invoke("vice:choose-executable"),
  launchVice: (payload) => ipcRenderer.invoke("vice:launch", payload),
  saveProject: (payload) => ipcRenderer.invoke("project:save", payload),
  loadProject: () => ipcRenderer.invoke("project:load")
});
