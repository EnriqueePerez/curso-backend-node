const { Transform } = require('stream');

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    const body = chunk.toString().split(' ');
    console.log(body);
    const bodyTransform = body.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    console.log(bodyTransform.join(''));
    callback();
  },
});

process.stdin.pipe(transformStream).pipe(process.stdout);
