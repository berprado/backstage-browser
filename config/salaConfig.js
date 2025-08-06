/**
 * 🏢 Configuración específica por sala
 * 
 * Este archivo centraliza toda la configuración individual de cada sala,
 * permitiendo personalizar URLs, temas, comportamie    console.warn(`[WARN] Configuración no encontrada para sala: ${salaId}. Usando configuración por defecto.`);
    return getSalaConfig('backstage1'); // Fallback a sala por defecto
  }
  
  console.log(`[OK] Configuración cargada para ${config.nombre} (${salaId})`);y características
 * específicas para cada ubicación.
 */

const salaConfigs = {
  backstage1: {
    id: 'backstage1',
    nombre: 'Sala Principal',
    descripcion: 'Sala principal de karaoke con configuración estándar',
    url: 'https://www.youtube.com',
    tema: {
      colorPrimario: '#667eea',
      colorSecundario: '#764ba2',
      gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    configuracion: {
      fullscreen: true,
      kiosk: true,
      autoReload: false,
      timeout: 30000,
      maxRetries: 3
    },
    funcionalidades: {
      toolbar: true,
      connectionStatus: true,
      reloadButton: true,
      salaIndicator: true
    }
  },

  backstage2: {
    id: 'backstage2',
    nombre: 'Sala VIP',
    descripcion: 'Sala VIP con configuración premium y contenido especializado',
    url: 'https://www.youtube.com/results?search_query=karaoke+premium',
    tema: {
      colorPrimario: '#f093fb',
      colorSecundario: '#f5576c',
      gradiente: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    configuracion: {
      fullscreen: true,
      kiosk: true,
      autoReload: true,
      timeout: 45000,
      maxRetries: 5
    },
    funcionalidades: {
      toolbar: true,
      connectionStatus: true,
      reloadButton: true,
      salaIndicator: true,
      premiumFeatures: true
    }
  },

  backstage3: {
    id: 'backstage3',
    nombre: 'Sala Premium',
    descripcion: 'Sala premium con contenido exclusivo y configuración avanzada',
    url: 'https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
    tema: {
      colorPrimario: '#4facfe',
      colorSecundario: '#00f2fe',
      gradiente: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    configuracion: {
      fullscreen: true,
      kiosk: true,
      autoReload: true,
      timeout: 60000,
      maxRetries: 5
    },
    funcionalidades: {
      toolbar: true,
      connectionStatus: true,
      reloadButton: true,
      salaIndicator: true,
      premiumFeatures: true,
      exclusiveContent: true
    }
  },

  backstage4: {
    id: 'backstage4',
    nombre: 'Sala Platinum',
    descripcion: 'Sala platinum con características especiales',
    url: 'https://www.youtube.com/results?search_query=karaoke+platinum',
    tema: {
      colorPrimario: '#a8edea',
      colorSecundario: '#fed6e3',
      gradiente: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    configuracion: {
      fullscreen: true,
      kiosk: true,
      autoReload: true,
      timeout: 60000,
      maxRetries: 5
    },
    funcionalidades: {
      toolbar: true,
      connectionStatus: true,
      reloadButton: true,
      salaIndicator: true,
      premiumFeatures: true
    }
  },

  backstage5: {
    id: 'backstage5',
    nombre: 'Sala Diamond',
    descripcion: 'Sala diamond con configuración de lujo',
    url: 'https://www.youtube.com/results?search_query=karaoke+diamond',
    tema: {
      colorPrimario: '#ffecd2',
      colorSecundario: '#fcb69f',
      gradiente: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    configuracion: {
      fullscreen: true,
      kiosk: true,
      autoReload: true,
      timeout: 60000,
      maxRetries: 5
    },
    funcionalidades: {
      toolbar: true,
      connectionStatus: true,
      reloadButton: true,
      salaIndicator: true,
      premiumFeatures: true,
      exclusiveContent: true
    }
  },

  backstage6: {
    id: 'backstage6',
    nombre: 'Sala Elite',
    descripcion: 'Sala elite con la configuración más avanzada',
    url: 'https://www.youtube.com/results?search_query=karaoke+elite',
    tema: {
      colorPrimario: '#ff9a9e',
      colorSecundario: '#fecfef',
      gradiente: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    configuracion: {
      fullscreen: true,
      kiosk: true,
      autoReload: true,
      timeout: 90000,
      maxRetries: 10
    },
    funcionalidades: {
      toolbar: true,
      connectionStatus: true,
      reloadButton: true,
      salaIndicator: true,
      premiumFeatures: true,
      exclusiveContent: true,
      vipSupport: true
    }
  }
};

/**
 * Obtiene la configuración de una sala específica
 * @param {string} salaId - ID de la sala (ej: 'backstage1')
 * @returns {Object} Configuración de la sala o configuración por defecto
 */
function obtenerConfigSala(salaId) {
  const config = salaConfigs[salaId];
  
  if (!config) {
    console.warn(`[WARN] Configuracion no encontrada para sala: ${salaId}. Usando configuracion por defecto.`);
    return salaConfigs.backstage1; // Fallback a sala principal
  }
  
  console.log(`[OK] Configuracion cargada para ${config.nombre} (${salaId})`);
  return config;
}

/**
 * Obtiene la lista de todas las salas disponibles
 * @returns {Array} Array con información básica de todas las salas
 */
function obtenerListaSalas() {
  return Object.values(salaConfigs).map(sala => ({
    id: sala.id,
    nombre: sala.nombre,
    descripcion: sala.descripcion
  }));
}

/**
 * Valida si una sala existe
 * @param {string} salaId - ID de la sala a validar
 * @returns {boolean} true si la sala existe, false en caso contrario
 */
function validarSala(salaId) {
  return Object.prototype.hasOwnProperty.call(salaConfigs, salaId);
}

module.exports = {
  salaConfigs,
  obtenerConfigSala,
  obtenerListaSalas,
  validarSala
};
