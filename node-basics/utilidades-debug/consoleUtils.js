// &s string
// &d number
// &j json

console.log('Un %s y un %s', 'perrito', 'gatito');

console.info('soy igual que el console.log');
console.warn('soy parecido al console.error');
console.assert(42 == '42'); //Nada
console.assert(42 === '42'); //Assertion failed

console.trace('un log mencionando la linea donde se ejecuta');

const util = require('util');

const debuglog = util.debuglog('foo'); //Tenemos que pasar por consola NODE_DEBUG=foo node consoleUtils.js para que nuestro debug funcione
//Esto permite hacer debug solamente cuando estamos en un entorno de desarrollo por ejemplo
debuglog('hello from foo');
