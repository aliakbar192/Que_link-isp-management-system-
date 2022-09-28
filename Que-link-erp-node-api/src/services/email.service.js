const config = require('../config/config');
const logger = require("../config/logger");
const {environmentTypes} = require("../utils/enum");
const {transporter} = require('../config/smtp');

const sendEmail = async (to, subject, text) => {
    const msg = { from: config.smtp.from, to, subject, text };
    await transporter.sendMail(msg, (err, info) => {
        if (err) {
            logger.error('Error sending email. ' + err.message);
        }
        if (config.server.env !== environmentTypes.DEVELOPMENT) {
            logger.log('Email sent: %s', info.messageId);
        }
    });
};

const sendResetPasswordEmail = async (name, email, key, token) => {
    const subject = 'Reset password ';
    const text = 'Hi ' + name + ',\n' +
        'We received a request to reset your password.\n' +
        key + ' is your account recovery code.\n' +
        'If you didn\'t request a new password, ignore this email.'
    await sendEmail(email, subject, text);
};

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
};
