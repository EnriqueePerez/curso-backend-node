const os = require('os');

// console.log('CPU info', os.cpus());
// console.log(
//   'IP address',
//   os.networkInterfaces().eth0.map((i) => i.address)
// );
console.log('Free Memory', `${os.freemem() / 1024 / 1024} MB libres`);
console.log('Os type: ', os.type());
console.log('OS version: ', os.release());
console.log('User info: ', os.userInfo());
