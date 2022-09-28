const express = require('express');
const validate = require('../middlewares/validate');
const {franchiseValidation} = require('../validations')
const {franchiseController} = require('../controllers');

const router = express.Router();

router.route('/')
  .post(validate(franchiseValidation.createFranchise), franchiseController.createFranchise)
  .get(validate(franchiseValidation.getFranchises), franchiseController.getFranchises);

router.route('/:franchiseId/dealer')
    .get(validate(franchiseValidation.getFranchise), franchiseController.getFranchiseDealers)

router.route('/:franchiseId')
  .get(validate(franchiseValidation.getFranchise), franchiseController.getFranchise)
  .put(validate(franchiseValidation.updateFranchise), franchiseController.updateFranchise)
  .delete(validate(franchiseValidation.deleteFranchise), franchiseController.deleteFranchise);

router.route('/:franchiseId/user')
  .get(validate(franchiseValidation.getFranchise), franchiseController.getFranchiseUsers)
  .post(validate(franchiseValidation.addFranchiseUser), franchiseController.addFranchiseUser);

router.route('/:franchiseId/user/:userRoleId')
  .delete(validate(franchiseValidation.deleteFranchiseUser), franchiseController.deleteFranchiseUser);

module.exports = router;
