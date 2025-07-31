const log = require('electron-log');

module.exports = {
  info: (message) => log.info(message),
  error: (message) => log.error(message)
};
