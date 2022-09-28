const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

let transporter = nodemailer.createTransport(
    {
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: {
            user: config.smtp.auth.user,
            pass: config.smtp.auth.pass
        },
    }
);


let connect = () => {
    transporter.verify()
        .then(() => {
            logger.info('SMTP connected');
        })
        .catch(error => {
            logger.error(error);
            throw new Error(`SMTP connection error: ${error.message}`);
        });
}

module.exports = {transporter, connect};
