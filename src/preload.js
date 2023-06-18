// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getRequest: (url, options) =>
    ipcRenderer.invoke("requests:get", url, options),
  postRequest: (url, data, options) =>
    ipcRenderer.invoke("requests:post", url, data, options),
  closeWindow: () => ipcRenderer.send("close-window"),
  hideWindow: () => ipcRenderer.send("hide-window"),
  getProcessesByName: (name) => ipcRenderer.invoke("processes:get", name)
});
