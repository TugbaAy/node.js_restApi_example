const http = require('http'); // http modülünü yükledik
const app = require('./app');
const port = process.env.PORT || 3000; // environment variables'den alınacak
const server = http.createServer(app);
server.listen(port);