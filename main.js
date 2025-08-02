
const { app, ipcMain, BrowserWindow } = require('electron');
const createWindow = require('./windows/createWindow');
const log = require('./utils/logger');
const configureUserData = require('./utils/configureUserData');

// Configurar userData y obtener el perfil de sala
const perfil = configureUserData();


app.whenReady().then(() => {
  log.info(`Iniciando aplicación para la sala: ${perfil}`);
  const mainWindow = createWindow(perfil);

  // Manejo global de errores de carga
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.on('did-fail-load', () => {
      log.error('Error al cargar la página principal. Mostrando página de error amigable.');
      mainWindow.loadFile('assets/error.html');
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('uncaughtException', (error) => {
  log.error('Error no capturado:', error);
});

ipcMain.on('go-back', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.webContents.canGoBack().then(canGoBack => {
      if (canGoBack) {
        return focusedWindow.webContents.goBack();
      }
    }).catch(error => {
      log.error('Error al navegar hacia atrás:', error);
    });
  }
});

ipcMain.on('exit-kiosk', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.setKiosk(false); // Salir del modo kiosko
    focusedWindow.setIcon('icon.ico'); // Establecer el ícono
    focusedWindow.setTitle('BackStage Karaoke'); // Establecer el título
  }
});

