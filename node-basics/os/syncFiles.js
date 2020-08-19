const fs = require('fs');

try {
  const file = process.argv[2];

  if (!file) {
    throw new Error('Debes indicar el archivo a analizar');
  }
  const content = fs.readFileSync(file).toString();
  const lines = content.split('\n').length;
  console.log('El archivo tiene', lines, 'lineas');
} catch (err) {
  console.log(err);
}
