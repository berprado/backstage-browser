const { app, BrowserWindow } = require('electron');
const path = require('path');

// Detectar parámetro --sala=backstageX
const salaArg = process.argv.find(arg => arg.startsWith('--sala='));
const perfil = salaArg ? salaArg.split('=')[1] : 'default';

function createWindow () {
  const win = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      partition: `persist:${perfil}`
    }
  });

  win.loadURL('https://www.youtube.com');
}

app.whenReady().then(createWindow);

