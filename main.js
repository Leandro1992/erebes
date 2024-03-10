// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const api = express()
const apiPort = 3000;
const controllers = require('./controllers/controller');
controllers.initControllers(api);
global.messages = [];


api.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
api.use('/', express.static(path.resolve(__dirname + '/front/build')));

if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.maximize();
  mainWindow.show();
  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL('http://127.0.0.1:3000')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    // if (BrowserWindow.getAllWindows().length === 0) createWindow()
    console.log("abri")
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});
