const { app, BrowserWindow, ipcMain } = require("electron");
const axios = require("axios");
const path = require("node:path");
const fs = require("node:fs");
const createDesktopShortcut = require('create-desktop-shortcuts');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Auto Updater
require("update-electron-app")({
  repo: "HM-Province/gta-journal",
  updateInterval: "1 hour",
});

// Change shortcut
const localPath = path.join(process.env.APPDATA, "../Local/GTAJournal");
if (fs.existsSync(path.join(localPath, "gta-journal.exe"))) {
  try {
    createDesktopShortcut({
      windows: {
        filePath: path.join(localPath, "GTA Journal.exe")
      }
    });

    const homeDir = require('os').homedir();
    const desktopDir = path.join(homeDir, './Desktop');
    if (fs.existsSync(path.join(desktopDir, "gta-journal.lnk")))
      fs.rmSync(path.join(desktopDir, "gta-journal.lnk"));
    fs.rmSync(path.join(localPath, "gta-journal.exe"))
  } catch (e) {
    console.error(e);
  }
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
    minWidth: 700,
    minHeight: 400,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};

async function handleAsyncGetRequest(_, url, options) {
  const response = await axios.get(url, options);
  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers,
  };
}

async function handleAsyncPostRequest(_, url, data, options) {
  const response = await axios.post(url, data, options);
  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers,
  };
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  const window = createWindow();

  ipcMain.handle("requests:get", handleAsyncGetRequest)
  ipcMain.handle("requests:post", handleAsyncPostRequest)

  ipcMain.on("hide-window", () => window.minimize());
  ipcMain.on("close-window", () => app.quit());
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
