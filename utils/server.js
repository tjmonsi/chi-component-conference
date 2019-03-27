const superstatic = require('superstatic');
const connect = require('connect');
const http = require('http');
const config = require('../superstatic.json');

const app = connect().use(superstatic({
  config: {
    headers: [
      {
        source: '**/*.js',
        headers: [{
          key: 'Access-Control-Allow-Origin',
          value: '*'
        }]
      }
    ],
    ...config
  },
  compression: true,
  cwd: 'public'
}));
http.createServer({}, app).listen(8080);
console.log('serving at http://localhost:8080');

/**
const fs = require('fs');
let key = null;
let cert = null;

try {
  key = fs.readFileSync('./dev-certificates/server.key');
  cert = fs.readFileSync('./dev-certificates/server.crt');
} catch (error) {
  console.log(error);
}

const httpsOptions = {
  key,
  cert
};

 */
