const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
  if ((req.metho = 'GET' && req.url == '/birthday')) {
    let body = [];
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        res.writeHead(202, { 'Content-Type': 'text/plain' });
        body = Buffer.concat(body).toString().split('-');

        const year = body[2];
        const month = body[1] - 1;
        const day = body[0];

        const birthday = new Date(year, month, day);
        const bornDay = birthday.getDay();
        let Day;

        switch (bornDay) {
          case 0:
            Day = 'Domingo';
            break;
          case 1:
            Day = 'Lunes';
            break;
          case 2:
            Day = 'Martes';
            break;
          case 3:
            Day = 'Miercoles';
            break;
          case 4:
            Day = 'Jueves';
            break;
          case 5:
            Day = 'Viernes';
            break;
          case 6:
            Day = 'Sábado';
            break;
        }
        res.end(Day.toString());
      });
  } else {
    res.statusCode = 404;
    res.end('Ruta no encontrada');
  }
});

server.listen(8000);
console.log('Servidor montado en http://localhost:8000');
