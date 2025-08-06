/**
 * 🔄 Gestor de Conexión y Reconexión
 * 
 * Maneja errores de carga, reintentos automáticos, y proporciona
 * una experiencia más robusta para cada sala de karaoke.
 */

const { BrowserWindow } = require('electron');
const path = require('path');

class ConnectionManager {
  constructor(window, salaConfig) {
    this.window = window;
    this.salaConfig = salaConfig;
    this.retryCount = 0;
    this.maxRetries = salaConfig.configuracion.maxRetries || 3;
    this.timeout = salaConfig.configuracion.timeout || 30000;
    this.isConnected = false;
    this.lastError = null;
    
    console.log(`🔄 ConnectionManager iniciado para ${salaConfig.nombre}`);
    console.log(`📊 Configuración: Max reintentos: ${this.maxRetries}, Timeout: ${this.timeout}ms`);
  }

  /**
   * Configura todos los event listeners para manejo de errores
   */
  setupErrorHandling() {
    // Manejo de fallos de carga
    this.window.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      this.lastError = { errorCode, errorDescription, validatedURL, timestamp: new Date() };
      
      console.log(`❌ Error de carga en ${this.salaConfig.nombre}:`);
      console.log(`   Código: ${errorCode}`);
      console.log(`   Descripción: ${errorDescription}`);
      console.log(`   URL: ${validatedURL}`);
      console.log(`   Intento: ${this.retryCount + 1}/${this.maxRetries}`);
      
      this.handleLoadFailure();
    });

    // Manejo de carga exitosa
    this.window.webContents.on('did-finish-load', () => {
      this.handleLoadSuccess();
    });

    // Manejo de navegación exitosa
    this.window.webContents.on('did-navigate', (event, navigationUrl) => {
      console.log(`🧭 Navegación exitosa en ${this.salaConfig.nombre}: ${navigationUrl}`);
      this.handleLoadSuccess();
    });

    // Manejo de crash de renderizador
    this.window.webContents.on('render-process-gone', (event, details) => {
      console.log(`💥 Proceso de renderizado caído en ${this.salaConfig.nombre}:`, details);
      this.handleCrash();
    });

    // Manejo de respuesta lenta
    this.window.webContents.on('unresponsive', () => {
      console.log(`⏱️ Página no responde en ${this.salaConfig.nombre}`);
      this.handleUnresponsive();
    });

    // Manejo de recuperación de respuesta
    this.window.webContents.on('responsive', () => {
      console.log(`✅ Página volvió a responder en ${this.salaConfig.nombre}`);
    });

    console.log(`✅ Event listeners configurados para ${this.salaConfig.nombre}`);
  }

  /**
   * Maneja fallos de carga con reintentos inteligentes
   */
  handleLoadFailure() {
    this.isConnected = false;
    
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const retryDelay = Math.min(3000 * this.retryCount, 10000); // Delay exponencial limitado
      
      console.log(`🔄 Reintentando en ${retryDelay}ms... (${this.retryCount}/${this.maxRetries})`);
      
      setTimeout(() => {
        console.log(`🚀 Ejecutando reintento ${this.retryCount} para ${this.salaConfig.nombre}`);
        this.window.reload();
      }, retryDelay);
    } else {
      console.log(`🚫 Máximo de reintentos alcanzado para ${this.salaConfig.nombre}. Mostrando página de error.`);
      this.showErrorPage();
    }
  }

  /**
   * Maneja carga exitosa
   */
  handleLoadSuccess() {
    if (!this.isConnected) {
      console.log(`🎉 Conexión exitosa en ${this.salaConfig.nombre}!`);
      this.isConnected = true;
      this.retryCount = 0; // Reset contador en carga exitosa
      this.lastError = null;
    }
  }

  /**
   * Maneja crash del proceso de renderizado
   */
  handleCrash() {
    console.log(`🔄 Reiniciando proceso de renderizado para ${this.salaConfig.nombre}...`);
    this.isConnected = false;
    
    // Esperar un momento antes de recargar
    setTimeout(() => {
      this.window.reload();
    }, 2000);
  }

  /**
   * Maneja página no responsiva
   */
  handleUnresponsive() {
    // Si hay configuración de auto-reload, reiniciar
    if (this.salaConfig.configuracion.autoReload) {
      console.log(`🔄 Auto-reload activado. Reiniciando ${this.salaConfig.nombre}...`);
      setTimeout(() => {
        this.window.reload();
      }, 5000);
    }
  }

  /**
   * Muestra la página de error personalizada
   */
  showErrorPage() {
    const errorData = {
      sala: this.salaConfig.nombre,
      salaId: this.salaConfig.id,
      errorInfo: this.lastError,
      maxRetries: this.maxRetries,
      gradiente: this.salaConfig.tema.gradiente
    };
    
    const errorUrl = `file://${path.join(__dirname, '../assets/error.html')}?data=${encodeURIComponent(JSON.stringify(errorData))}`;
    this.window.loadURL(errorUrl);
  }

  /**
   * Fuerza un reintento manual
   */
  forceRetry() {
    console.log(`🔄 Reintento manual solicitado para ${this.salaConfig.nombre}`);
    this.retryCount = 0; // Reset contador para reintento manual
    this.window.loadURL(this.salaConfig.url);
  }

  /**
   * Obtiene información del estado actual
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      lastError: this.lastError,
      salaName: this.salaConfig.nombre
    };
  }
}

module.exports = ConnectionManager;
