const fs = require('fs');
const path = require('path');

const salas = ['backstage1', 'backstage2', 'backstage3', 'backstage4', 'backstage5', 'backstage6'];
const scriptsDir = path.join(__dirname);

salas.forEach(sala => {
  const content = `"C:\\Program Files\\backstage-browser\\backstage-browser.exe" --sala=${sala}`;
  fs.writeFileSync(path.join(scriptsDir, `${sala}.bat`), content);
});
