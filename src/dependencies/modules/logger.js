// Logger.js v1.0.0

const CONSOLE = require('console').Console,
      FS = require('fs');

function date(delimiter) {
    delimiter = (delimiter)? delimiter : ':';

    let date = new Date();
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()} ${date.getUTCHours()}${delimiter}${date.getUTCMinutes()}${delimiter}${date.getUTCSeconds()}`;
}

function log(message) {
    let output = `[${date()}] ${message}`;

    LOGGER.log(output);
    console.log(output);
}

if (!FS.existsSync('./data/logs')) {
    FS.mkdirSync('./data/logs', { recursive: true });
}

const LOGFILE = FS.createWriteStream(`./data/logs/${date('.')}.log`),
      LOGGER = new CONSOLE({ stdout: LOGFILE });

process.on('unhandledRejection', (err) => {
    log(err.stack);

    LOGFILE.on('finish', () => { process.exit(1); });
    LOGFILE.end();
});

process.on('uncaughtException', (err) => {
    log(err.stack);

    LOGFILE.on('finish', () => { process.exit(1); });
    LOGFILE.end();
});

module.exports = log;