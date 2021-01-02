const path = require('path');

console.log('__filename ', __filename);
console.log('dire', __dirname)

var pathObj = path.parse(__filename);

console.log('pathObj ', pathObj)