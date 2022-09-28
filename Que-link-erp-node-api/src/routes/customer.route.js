const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { customerValidation } = require("../validations");
const { customerController } = require("../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    validate(customerValidation.createCustomer),
    customerController.createCustomer
  )
  .get(
    validate(customerValidation.getCustomers),
    customerController.getCustomers
  );

router
  .route("/:customerId")
  .get(validate(customerValidation.getCustomer), customerController.getCustomer)
  .put(
    validate(customerValidation.updateCustomer),
    customerController.updateCustomer
  )
  .delete(
    validate(customerValidation.deleteCustomer),
    customerController.deleteCustomer
  );

router
  .route("/:customerId/user")
  .get(
    validate(customerValidation.getCustomer),
    customerController.getCustomerUsers
  )
  .post(
    validate(customerValidation.addCustomerUser),
    customerController.addCustomerUser
  );

router
  .route("/:customerId/user/:userRoleId")
  .delete(
    validate(customerValidation.deleteCustomerUser),
    customerController.deleteCustomerUser
  );

router
  .route("/:customerId/subscription")
  .get(
    validate(customerValidation.getCustomerSubscription),

    customerController.getCustomerSubscriptions
  )
  .post(
    validate(customerValidation.addCustomerSubscription),
    auth(),
    customerController.addCustomerSubscription
  );

router
  .route("/:customerId/subscription/:customerSubscriptionId")
  .delete(
    validate(customerValidation.deleteCustomerSubscription),
    customerController.deleteCustomerSubscription
  );

module.exports = router;
