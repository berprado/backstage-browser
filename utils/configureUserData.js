const { app } = require('electron');
const path = require('path');

/**
 * Configura el directorio `userData` basado en el argumento `--sala=`.
 * Si no se proporciona el argumento, usa un valor predeterminado.
 */
function configureUserData() {
  const salaArg = process.argv.find(arg => arg.startsWith('--sala='));
  const sala = salaArg ? salaArg.split('=')[1] : 'default';

  // Configurar el path de userData
  const userDataPath = path.join(app.getPath('appData'), `backstage/${sala}`);
  app.setPath('userData', userDataPath);

  console.log(`[OK] userData path configurado para: ${userDataPath}`);
  return sala;
}

module.exports = configureUserData;
