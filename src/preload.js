const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getRequest: (url, options) => ipcRenderer.invoke('requests:get', url, options),
  postRequest: (url, data, options) => ipcRenderer.invoke('requests:post', url, data, options),
  closeWindow: () => ipcRenderer.send("close-window"),
  hideWindow: () => ipcRenderer.send("hide-window")
})