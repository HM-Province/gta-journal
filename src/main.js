const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const axios = require("axios");

// Auto Updater
require("update-electron-app")({
  repo: "HM-Province/gta-journal",
  updateInterval: "1 hour",
});

if (require("electron-squirrel-startup")) app.quit();

function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 400,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "./view/index.html"));
}

async function handleAsyncGetRequest(_, url, options) {
  const response = await axios.get(url, options);
  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers
  }
}

async function handleAsyncPostRequest(_, url, data, options) {
  const response = await axios.post(url, data, options);
  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("requests:get", handleAsyncGetRequest)
  ipcMain.handle("requests:post", handleAsyncPostRequest)

  ipcMain.on("hide-window", () => app.hide());
  ipcMain.on("close-window", () => app.quit());

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
