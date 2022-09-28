const express = require('express');
const validate = require('../middlewares/validate');
const {dealerValidation} = require('../validations')
const {dealerController} = require('../controllers');

const router = express.Router();

router.route('/')
  .post(validate(dealerValidation.createDealer), dealerController.createDealer)
  .get(validate(dealerValidation.getDealers), dealerController.getDealers);

router.route('/:dealerId/customer')
    .get(validate(dealerValidation.getDealer), dealerController.getDealerCustomers)

router.route('/:dealerId')
  .get(validate(dealerValidation.getDealer), dealerController.getDealer)
  .put(validate(dealerValidation.updateDealer), dealerController.updateDealer)
  .delete(validate(dealerValidation.deleteDealer), dealerController.deleteDealer);

router.route('/:dealerId/user')
  .get(validate(dealerValidation.getDealers), dealerController.getDealerUsers)
  .post(validate(dealerValidation.addDealerUser), dealerController.addDealerUser);

router.route('/:dealerId/user/:userRoleId')
  .delete(validate(dealerValidation.deleteDealerUser), dealerController.deleteDealerUser);

module.exports = router;
