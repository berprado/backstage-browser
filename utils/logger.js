/**
 * 📝 Sistema de Logging Avanzado para Backstage Browser
 * 
 * Proporciona logging separado por sala con diferentes niveles,
 * rotación de archivos y formato mejorado para debugging.
 */

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class Logger {
  constructor(sala) {
    this.sala = sala;
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.logFile = path.join(this.logDir, `${sala}.log`);
    this.maxLogSize = 5 * 1024 * 1024; // 5MB
    this.maxLogFiles = 5;
    
    this.ensureLogDirectory();
    this.info(`🚀 Logger iniciado para sala: ${sala}`);
  }

  /**
   * Asegura que el directorio de logs existe
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Formatea el timestamp para los logs
   */
  getTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Escribe un mensaje al archivo de log
   */
  writeToFile(level, message) {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] [${this.sala.toUpperCase()}] [${level}] ${message}\n`;
    
    try {
      // Verificar si necesitamos rotar el log
      if (fs.existsSync(this.logFile)) {
        const stats = fs.statSync(this.logFile);
        if (stats.size > this.maxLogSize) {
          this.rotateLogFile();
        }
      }
      
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error(`Error escribiendo al log: ${error.message}`);
    }
  }

  /**
   * Rota el archivo de log cuando excede el tamaño máximo
   */
  rotateLogFile() {
    try {
      // Mover archivos existentes
      for (let i = this.maxLogFiles - 1; i > 0; i--) {
        const oldFile = `${this.logFile}.${i}`;
        const newFile = `${this.logFile}.${i + 1}`;
        
        if (fs.existsSync(oldFile)) {
          if (i === this.maxLogFiles - 1) {
            fs.unlinkSync(oldFile); // Eliminar el más antiguo
          } else {
            fs.renameSync(oldFile, newFile);
          }
        }
      }
      
      // Mover el archivo actual
      if (fs.existsSync(this.logFile)) {
        fs.renameSync(this.logFile, `${this.logFile}.1`);
      }
      
      console.log(`📁 Log rotado para sala ${this.sala}`);
    } catch (error) {
      console.error(`Error rotando log: ${error.message}`);
    }
  }

  /**
   * Log de información general
   */
  info(message) {
    const coloredMessage = `\x1b[36m${message}\x1b[0m`; // Cyan
    console.log(`[${this.sala.toUpperCase()}] ${coloredMessage}`);
    this.writeToFile('INFO', message);
  }

  /**
   * Log de errores
   */
  error(message, error = null) {
    const fullMessage = error ? `${message} - ${error.message || error}` : message;
    const coloredMessage = `\x1b[31m❌ ${fullMessage}\x1b[0m`; // Red
    console.error(`[${this.sala.toUpperCase()}] ${coloredMessage}`);
    this.writeToFile('ERROR', fullMessage);
    
    // Si hay stack trace, también lo guardamos
    if (error && error.stack) {
      this.writeToFile('ERROR', `Stack trace: ${error.stack}`);
    }
  }

  /**
   * Log de advertencias
   */
  warn(message) {
    const coloredMessage = `\x1b[33m⚠️ ${message}\x1b[0m`; // Yellow
    console.warn(`[${this.sala.toUpperCase()}] ${coloredMessage}`);
    this.writeToFile('WARN', message);
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      const coloredMessage = `\x1b[90m🐛 ${message}\x1b[0m`; // Gray
      console.log(`[${this.sala.toUpperCase()}] ${coloredMessage}`);
      this.writeToFile('DEBUG', message);
    }
  }

  /**
   * Log de eventos de conexión
   */
  connection(message, status = 'info') {
    const icons = {
      'success': '🟢',
      'error': '🔴',
      'warning': '🟡',
      'info': '🔵'
    };
    
    const icon = icons[status] || '🔵';
    const coloredMessage = `${icon} CONEXIÓN: ${message}`;
    
    if (status === 'error') {
      this.error(coloredMessage);
    } else if (status === 'warning') {
      this.warn(coloredMessage);
    } else {
      this.info(coloredMessage);
    }
  }

  /**
   * Log de eventos de usuario
   */
  userAction(action, details = '') {
    const message = `👤 USUARIO: ${action}${details ? ` - ${details}` : ''}`;
    this.info(message);
  }

  /**
   * Log de rendimiento
   */
  performance(operation, duration) {
    const message = `⚡ RENDIMIENTO: ${operation} completado en ${duration}ms`;
    this.info(message);
  }

  /**
   * Obtiene información del archivo de log
   */
  getLogInfo() {
    const info = {
      sala: this.sala,
      logFile: this.logFile,
      exists: fs.existsSync(this.logFile),
      size: 0,
      lastModified: null
    };
    
    if (info.exists) {
      const stats = fs.statSync(this.logFile);
      info.size = stats.size;
      info.lastModified = stats.mtime;
    }
    
    return info;
  }

  /**
   * Lee las últimas líneas del log
   */
  getTailLog(lines = 50) {
    if (!fs.existsSync(this.logFile)) {
      return [];
    }
    
    try {
      const content = fs.readFileSync(this.logFile, 'utf8');
      const allLines = content.split('\n').filter(line => line.trim());
      return allLines.slice(-lines);
    } catch (error) {
      this.error('Error leyendo log', error);
      return [];
    }
  }
}

/**
 * Factory function para crear loggers por sala
 */
function createLogger(sala) {
  return new Logger(sala);
}

module.exports = {
  Logger,
  createLogger
};
