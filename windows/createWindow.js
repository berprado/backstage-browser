const { BrowserWindow } = require('electron');
const path = require('path');
const config = require('../config.json');

function createWindow(perfil) {
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true
  });

  splash.loadFile(path.join(__dirname, '../assets/splash.html'));

  const win = new BrowserWindow({
    fullscreen: config.fullscreen,
    kiosk: config.kiosk,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      partition: `persist:${perfil}`
    }
  });

  win.loadURL(config.defaultURL);

  win.once('ready-to-show', () => {
    splash.close();
    win.show();
  });

  win.webContents.on('did-fail-load', () => {
    win.loadURL('file://' + path.join(__dirname, '../assets/error.html'));
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      event.preventDefault();
    }

    if (input.control && input.alt && input.key.toLowerCase() === 's') {
      win.setKiosk(false); // Salir del modo kiosko
    }

    if (input.control && input.alt && input.key.toLowerCase() === 'k') {
      win.setKiosk(true); // Volver al modo kiosko
    }
  });

  return win;
}

module.exports = createWindow;
