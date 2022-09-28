const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const {environmentTypes} = require("../utils/enum");

dotenv.config({path: path.join(__dirname, '../../.env')});

const environmentVariablesSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid(environmentTypes.PRODUCTION, environmentTypes.DEVELOPMENT, environmentTypes.TEST).default(environmentTypes.DEVELOPMENT),
        PORT: Joi.number().default(5000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required().allow(null, ""),
        DB_DIALECT: Joi.string().required().valid('mysql', 'mariadb', 'postgres', 'mssql'),
        JWT_SECRET: Joi.string().required(),
        JWT_AUTH_EXPIRE_TIME: Joi.number().default(43800),
        JWT_ACCESS_EXPIRE_TIME: Joi.number().default(30),
        JWT_RESET_EXPIRE_TIME: Joi.number().default(5),
        SMTP_HOST: Joi.string().description('server that will send the emails'),
        SMTP_PORT: Joi.number().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().description('username for email server'),
        SMTP_PASSWORD: Joi.string().description('password for email server'),
        SMTP_EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    })
    .unknown()
    .required();

const {
    value: environmentVariables,
    error
} = environmentVariablesSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}


module.exports = {
    server: {
        env: environmentVariables.NODE_ENV,
        port: environmentVariables.PORT,
    },
    jwt: {
        secret: environmentVariables.JWT_SECRET,
        authExpireTime: environmentVariables.JWT_AUTH_EXPIRE_TIME,
        accessExpireTime: environmentVariables.JWT_ACCESS_EXPIRE_TIME,
        resetExpireTime: environmentVariables.JWT_RESET_EXPIRE_TIME,
    },
    db: {
        host: environmentVariables.DB_HOST,
        port: environmentVariables.DB_PORT,
        name: environmentVariables.DB_NAME,
        auth: {
            user: environmentVariables.DB_USERNAME,
            pass: environmentVariables.DB_PASSWORD,
        },
        dialect: environmentVariables.DB_DIALECT,
    },
    smtp: {
        host: environmentVariables.SMTP_HOST,
        port: environmentVariables.SMTP_PORT,
        auth: {
            user: environmentVariables.SMTP_USERNAME,
            pass: environmentVariables.SMTP_PASSWORD,
        },
        from: environmentVariables.SMTP_EMAIL_FROM,
    },
};
