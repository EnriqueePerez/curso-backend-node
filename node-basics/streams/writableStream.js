const { Writable } = require('stream');

const writableStream = new Writable({
  defaultEncoding: 'utf-8',
  /**
   *
   * @param {*} chunk el buffer de entrada
   * @param {*} encoding la codificación
   * del buffer, si el chunk es un string
   * el enconding es la codificación en
   * caracteres de esa cadena, si la
   * codificación es un buffer esta se puede
   * ignorar
   * @param {*} callback esta función es
   * llamada cuando se complete el
   * procesamiento para el chunk
   * proporcionado.
   */
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
});

process.stdin.pipe(writableStream);
