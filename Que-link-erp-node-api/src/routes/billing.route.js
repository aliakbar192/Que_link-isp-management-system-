const express = require("express");
const validate = require("../middlewares/validate");
const { billingValidation } = require("../validations");
const { billingController } = require("../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    validate(billingValidation.createBilling),
    billingController.createBilling
  )
  .get(validate(billingValidation.getBillings), billingController.getBillings);

router
  .route("/:billingId")
  .get(validate(billingValidation.getBilling), billingController.getBilling)
  .put(
    validate(billingValidation.updateBilling),
    billingController.updateBilling
  )
  .delete(
    validate(billingValidation.deleteBilling),
    billingController.deleteBilling
  );
// router
//   .route("/dealer/:dalerId")
//   .get(
//     validate(billingValidation.getBillingByDealer),
//     billingController.getBillingByDealer
//   );

// router
//   .route("/:customerId/user")
//   .get(
//     validate(customerValidation.getCustomer),
//     customerController.getCustomerUsers
//   )
//   .post(
//     validate(customerValidation.addCustomerUser),
//     customerController.addCustomerUser
//   );

module.exports = router;
