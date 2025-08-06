
const { app, ipcMain, BrowserWindow } = require('electron');
const createWindow = require('./windows/createWindow');
const { createLogger } = require('./utils/logger');
const configureUserData = require('./utils/configureUserData');

// Configurar userData y obtener el perfil de sala
const perfil = configureUserData();

// Crear logger específico para esta sala
const logger = createLogger(perfil);

app.whenReady().then(() => {
  logger.info(`[INIT] Iniciando aplicacion para la sala: ${perfil}`);
  const mainWindow = createWindow(perfil);

  // Manejo global de errores de carga
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.on('did-fail-load', () => {
      logger.error('Error al cargar la pagina principal. Mostrando pagina de error amigable.');
      mainWindow.loadFile('assets/error.html');
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logger.info('[CLOSE] Cerrando aplicacion - todas las ventanas cerradas');
    app.quit();
  }
});

process.on('uncaughtException', (error) => {
  logger.error('Error no capturado:', error);
});

ipcMain.on('go-back', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.webContents.canGoBack().then(canGoBack => {
      if (canGoBack) {
        logger.userAction('Navegacion hacia atras');
        return focusedWindow.webContents.goBack();
      }
    }).catch(error => {
      logger.error('Error al navegar hacia atrás:', error);
    });
  }
});

ipcMain.on('exit-kiosk', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    logger.userAction('Salir del modo kiosko');
    focusedWindow.setKiosk(false); // Salir del modo kiosko
    focusedWindow.setIcon('icon.ico'); // Establecer el ícono
    focusedWindow.setTitle('BackStage Karaoke'); // Establecer el título
  }
});

