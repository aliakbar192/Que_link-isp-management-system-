const {Sequelize} = require('sequelize');
const config = require('./config');
const {environmentTypes} = require("../utils/enum");


const sequelize = new Sequelize(config.db.name, config.db.auth.user, config.db.auth.pass, {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.server.env === environmentTypes.DEVELOPMENT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = {Sequelize, sequelize};
