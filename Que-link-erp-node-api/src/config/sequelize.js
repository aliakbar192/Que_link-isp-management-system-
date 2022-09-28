const models = require("../models");
const logger = require("./logger");

let authenticate = () => {
  models.sequelize
    .authenticate()
    .then(() => {
      logger.info("Database connected");
    })
    .catch((error) => {
      logger.error(error);
      throw new Error(`Database connection error: ${error.message}`);
    });
};

let sync = (forceSync = false) => {
  models.sequelize
    .sync({ force: forceSync })
    .then(() => {
      logger.info(" synced");
    })
    .catch((error) => {
      logger.error(error);
      throw new Error(`Database sync error: ${error.message}`);
    });
};

module.exports = {
  authenticate,
  sync,
};
