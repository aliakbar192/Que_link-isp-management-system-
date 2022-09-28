var cron = require("node-cron");
const logger = require("./logger");
const { customerSubscriptionService } = require("../services");

start = () => {
  cron.schedule("0 0 0 * * *", async () => {
    logger.info("Running Crone");
    await customerSubscriptionService.syncCustomerSubscriptions();
  });
};

module.exports = {
  start,
};
