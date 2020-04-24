// Cluster v0.1.0-alpha
// Node.js v14.0.0

(async () => {

    const LOG = require('./modules/logger.js');

    LOG('Cluster v0.1.0-alpha [Node.js v13.13.0]');
    LOG('╔══════════════════════════════════════╗');
    LOG('║ [1/3] Importing modules              ║');

    const FS = require('fs'),
          HTTP = require('http'),
          HTTP2 = require('http2'),
          SSL = require('./modules/ssl.js');
    
    LOG('║ [2/3] Loading configuration          ║');

    const CONFIG = {
        port: require('./../config/port.json'),
        ssl: require('./../config/ssl.json')
    };

    LOG('║ [3/3] Configuring SSL certificate(s) ║');

    let http = HTTP.createServer((req, res) => {
        let url = req.url.split('/');

        if (url[1] === '.well-known') {
            res.statusCode = 200;
            res.end(FS.readFileSync(`./data/tmp/acme/${url[3]}`));
        }

        res.statusCode = 404;
        res.end();
    }).listen(CONFIG.port.HTTP.Port, CONFIG.port.HTTP.IP);

    const { key, cert } = await SSL(CONFIG.ssl);

    http.close();

    LOG("╚══════════════════════════════════════╝");

    HTTP.createServer((req, res) => {
        res.writeHead(302, { 'Location': `https://${req.headers.host}${req.url}` });
        res.end();
    }).listen(CONFIG.port.HTTP.Port, CONFIG.port.HTTP.IP);

    HTTP2.createSecureServer({
        key,
        cert,
        allowHTTP1: true
    }, (req, res) => {
        LOG(`Connection established from ${req.connection.remoteAddress}`);
        res.statusCode = 200;
        res.end();
    }).listen(CONFIG.port.HTTPS.Port, CONFIG.port.HTTPS.IP);

})();