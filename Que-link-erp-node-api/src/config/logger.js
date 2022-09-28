const winston = require('winston');
const config = require('./config');
const {environmentTypes} = require("../utils/enum");

const logFormatter = (printf) => printf((info) => `${info.level}: ${info.timestamp} ${info.message}`);

const logger = winston.createLogger({
    level: config.server.env === environmentTypes.DEVELOPMENT ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack: true}),
        config.server.env === environmentTypes.DEVELOPMENT ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        logFormatter(winston.format.printf)
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

module.exports = logger;
