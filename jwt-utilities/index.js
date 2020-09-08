const jwt = require('jsonwebtoken');

const [, , option, secret, nameOrToken] = process.argv; //Getting the data from the console (in order)

if (!option || !secret || !nameOrToken) {
  return console.log('Missing arguments'); //If something missing, send error
}

function signToken(payload, secret) {
  return jwt.sign(payload, secret); //method to sign and create a new token
}

function verifyToken(token, secret) {
  return jwt.verify(token, secret); //method to verify the token
}

if (option === 'sign') {
  console.log(signToken({ sub: nameOrToken }, secret));
} else if (option === 'verify') {
  console.log(verifyToken(nameOrToken, secret));
} else {
  console.log('Option needs to be "sign" or "verify"');
}
