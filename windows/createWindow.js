const { BrowserWindow } = require('electron');
const path = require('path');
const { obtenerConfigSala } = require('../config/salaConfig');

function createWindow(perfil) {
  // Obtener configuración específica de la sala
  const salaConfig = obtenerConfigSala(perfil);
  
  console.log(`[WINDOW] Creando ventana para ${salaConfig.nombre}`);

  const splash = new BrowserWindow({
    fullscreen: true, // Splash a pantalla completa
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Cargar splash con información de la sala
  splash.loadFile(path.join(__dirname, '../assets/splash.html'), {
    query: { 
      sala: salaConfig.id,
      nombre: salaConfig.nombre,
      gradiente: encodeURIComponent(salaConfig.tema.gradiente)
    }
  });

  const win = new BrowserWindow({
    fullscreen: salaConfig.configuracion.fullscreen,
    kiosk: salaConfig.configuracion.kiosk,
    show: false,
    icon: path.join(__dirname, '../assets/icons/icon_256x256.ico'), // Icono personalizado actualizado
    title: 'BACKSTAGE BROWSER', // Título personalizado
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      partition: `persist:${perfil}`,
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Cargar URL específica de la sala
  win.loadURL(salaConfig.url);

  // Configurar gestor de conexión y errores
  const ConnectionManager = require('../utils/connectionManager');
  const connectionManager = new ConnectionManager(win, salaConfig);
  connectionManager.setupErrorHandling();

  win.once('ready-to-show', () => {
    // Esperar 8 segundos antes de cerrar el splash y mostrar la ventana principal
    setTimeout(() => {
      splash.close();
      win.show();
      console.log(`[READY] ${salaConfig.nombre} lista y visible`);
    }, 8000);
  });

  // Mantener el manejo de teclas original
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      event.preventDefault();
    }

    // Atajo para salir del modo kiosko: Ctrl+Alt+S
    if (input.control && input.alt && input.key.toLowerCase() === 's') {
      win.setKiosk(false);
      win.setTitle('BACKSTAGE BROWSER'); // Forzar título al salir de kiosko
      win.setIcon(path.join(__dirname, '../assets/icons/icon_256x256.ico')); // Forzar icono actualizado
      console.log(`[KIOSK] Modo kiosko desactivado en ${salaConfig.nombre}`);
    }

    // Atajo para volver al modo kiosko: Ctrl+Alt+K
    if (input.control && input.alt && input.key.toLowerCase() === 'k') {
      win.setKiosk(true);
      // Emitir manualmente el evento 'enter-kiosk' para que el menú flotante reaparezca
      win.emit('enter-kiosk');
      console.log(`[KIOSK] Modo kiosko activado en ${salaConfig.nombre}`);
    }

    // Atajo para forzar recarga: Ctrl+Alt+R
    if (input.control && input.alt && input.key.toLowerCase() === 'r') {
      console.log(`[RELOAD] Recarga manual solicitada en ${salaConfig.nombre}`);
      connectionManager.forceRetry();
    }
  });

  // Adjuntar el connectionManager a la ventana para acceso posterior
  win.connectionManager = connectionManager;

  return win;
}

module.exports = createWindow;
