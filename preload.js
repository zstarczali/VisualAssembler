const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getViceConfig: () => ipcRenderer.invoke("vice:get-config"),
  chooseViceExecutable: () => ipcRenderer.invoke("vice:choose-executable"),
  launchVice: (payload) => ipcRenderer.invoke("vice:launch", payload),
  saveProject: (payload) => ipcRenderer.invoke("project:save", payload),
  loadProject: () => ipcRenderer.invoke("project:load")
});
