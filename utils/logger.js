const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'info',  // Default log level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: path.join(logDir, 'info.log'), level: 'info' }),
        new winston.transports.File({ filename: path.join(logDir, 'warn.log'), level: 'warn' }),
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
    ],
});

module.exports = logger;
