---
applyTo: '**'
---
# INSTRUCCIONES PARTE 1
Debes analizar este conjunto de instrucciones y darme tu punto de vista. Si crees que algo se puede mejorar, si crees que las instrucciones son inconsistentes con la implementacion que ya se tiene, si crees que algo esta mal, en resumen me das los pros y los contras que resulten de tu analisis y discutimos si se procede y como se procede a la implemententacion, ya sea siguiendo mis instrucciones al pie de la letra, modificandolas en base a tus consideraciones o descartandolas.
---

### ✅ Primer paso: Separar datos por sala con `userData`

Esto es esencial para que cada sala tenga sus propias cookies, historial, sesiones, etc., sin interferir con las otras.

---

### 🔧 Instrucciones Detalladas

#### 1. Abre el archivo `main.js`.

#### 2. Justo al inicio del archivo (antes de `app.whenReady()`), pegá este bloque:

```js
const { app } = require('electron');
const path = require('path');

// Extraer el nombre de sala desde argumentos
function getSalaArgumento() {
  const argSala = process.argv.find(arg => arg.startsWith('--sala='));
  if (!argSala) {
    console.error('❌ No se proporcionó el argumento --sala=');
    app.exit(1); // Salir si no se especificó
  }
  return argSala.split('=')[1];
}

const sala = getSalaArgumento();
app.setPath('userData', path.join(app.getPath('appData'), `backstage/${sala}`));
console.log(`✅ userData path configurado para: ${app.getPath('userData')}`);
```

---

### 📌 ¿Qué hace esto?

* **Lee el parámetro `--sala=backstageX`** desde los argumentos.
* **Configura una ruta diferente de `userData`** para cada sala.
* **Si no se proporciona el parámetro**, termina la ejecución con un mensaje claro.

---

### ✅ Tarea para ti

1. Editá `main.js` y agregá el bloque de código como se indicó.
2. Ejecutá una sala con `npm run backstage2`.
3. Confirmá que se imprime en consola algo como:

```
✅ userData path configurado para: C:\Users\TU_USUARIO\AppData\Roaming\backstage\backstage2
```

4. Analicemos el resultado (puede ser revisando el bloque del `main.js` modificado y la salida de la consola).

---