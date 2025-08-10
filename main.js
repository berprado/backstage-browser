
const { app, ipcMain, BrowserWindow } = require('electron');
const createWindow = require('./windows/createWindow');
const { createLogger } = require('./utils/logger');
const configureUserData = require('./utils/configureUserData');

// Configurar userData y obtener el perfil de sala
const perfil = configureUserData();

// Crear logger específico para esta sala
const logger = createLogger(perfil);


let mainWindow;
let toolbarWindow;

app.whenReady().then(() => {
  logger.info(`[INIT] Iniciando aplicacion para la sala: ${perfil}`);
  mainWindow = createWindow(perfil);

  // Manejo global de errores de carga
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.on('did-fail-load', () => {
      logger.error('Error al cargar la pagina principal. Mostrando pagina de error amigable.');
      mainWindow.loadFile('assets/error.html');
    });
  }

  // Crear overlay solo después del splash
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      toolbarWindow = new BrowserWindow({
        width: 400,
        height: 130, // Aumenta la altura para que el padding superior sea visible
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        focusable: false,
        skipTaskbar: true,
        hasShadow: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      toolbarWindow.setIgnoreMouseEvents(false); // Permitir clicks
      toolbarWindow.setAlwaysOnTop(true, 'screen-saver');
      toolbarWindow.loadFile('assets/toolbar.html');
      toolbarWindow.setVisibleOnAllWorkspaces(true);
      toolbarWindow.setMenuBarVisibility(false);

      // Centrar overlay en la parte inferior de la pantalla principal
      const setToolbarPosition = () => {
        if (!mainWindow || mainWindow.isDestroyed()) return;
        const mainBounds = mainWindow.getBounds();
        const toolbarBounds = toolbarWindow.getBounds();
        const x = Math.round(mainBounds.x + (mainBounds.width - toolbarBounds.width) / 2);
        const y = Math.round(mainBounds.y + mainBounds.height - toolbarBounds.height - 20);
        toolbarWindow.setBounds({ x, y, width: toolbarBounds.width, height: toolbarBounds.height });
      };
      mainWindow.on('move', setToolbarPosition);
      mainWindow.on('resize', setToolbarPosition);
      mainWindow.on('show', setToolbarPosition);
      setToolbarPosition();

      // Ocultar overlay si la ventana principal se cierra
      mainWindow.on('closed', () => {
        if (toolbarWindow && !toolbarWindow.isDestroyed()) toolbarWindow.close();
      });

      // Ocultar overlay si la ventana principal se minimiza
      mainWindow.on('minimize', () => {
        if (toolbarWindow && !toolbarWindow.isDestroyed()) toolbarWindow.hide();
      });
      mainWindow.on('restore', () => {
        if (toolbarWindow && !toolbarWindow.isDestroyed()) toolbarWindow.show();
        setToolbarPosition();
      });

      // Ocultar overlay si la ventana principal pierde el foco
      mainWindow.on('blur', () => {
        if (toolbarWindow && !toolbarWindow.isDestroyed()) toolbarWindow.hide();
      });
      // Mostrar overlay si la ventana principal recupera el foco y está en modo kiosko
      mainWindow.on('focus', () => {
        if (toolbarWindow && !toolbarWindow.isDestroyed() && mainWindow.isKiosk()) {
          toolbarWindow.show();
          setToolbarPosition();
        }
      });

      // Ocultar overlay al salir de modo kiosko
      mainWindow.on('leave-kiosk', () => {
        if (toolbarWindow && !toolbarWindow.isDestroyed()) toolbarWindow.hide();
      });
      // Mostrar overlay al entrar en modo kiosko
      mainWindow.on('enter-kiosk', () => {
        if (toolbarWindow && !toolbarWindow.isDestroyed()) {
          toolbarWindow.show();
          setToolbarPosition();
        }
      });
    }, 8000); // Espera igual al splash
  });
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


// Acciones del menú flotante overlay
ipcMain.on('toolbar-action', (event, action) => {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  switch (action) {
    case 'back': {
      // Usar la nueva API navigationHistory.canGoBack y goBack
      const navHistory = mainWindow.webContents.navigationHistory;
      if (navHistory && navHistory.canGoBack) {
        logger.userAction('Navegacion hacia atras');
        navHistory.goBack();
      }
      break;
    }
    case 'reload':
      logger.userAction('Recargar pagina');
      mainWindow.webContents.reload();
      break;
    case 'home':
      logger.userAction('Ir a inicio (YouTube)');
      mainWindow.webContents.loadURL('https://www.youtube.com/');
      break;
    case 'top':
      logger.userAction('Scroll arriba');
      mainWindow.webContents.executeJavaScript('window.scrollTo({ top: 0, behavior: "smooth" })');
      break;
    default:
      break;
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

