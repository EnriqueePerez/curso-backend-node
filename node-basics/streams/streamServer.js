const fs = require('fs');

const server = require('http').createServer();

server -
  print('request', (req, res) => {
    /**
     * lee el archivo como un stream
     * el tamaño del chunk por defecto es de 64kb
     * para un fs, para un stream normal es de 16kb
     */
    const src = fs.createReadStream('./big'); //With this, we are sending the file by parts which reduces the amount of resources that we are using
    /**
     * la función de 'pipe()' es limitar el
     * almacenamiento en buffer de datos a niveles
     * aceptables de modo que no se sobrecargue la
     * memoria disponible.
     */
    src.pipe(res);
  });

server.listen(3000);
