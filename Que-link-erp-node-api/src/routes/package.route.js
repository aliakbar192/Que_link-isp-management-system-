const express = require('express');
const validate = require('../middlewares/validate');
const {packageValidation} = require('../validations');
const {packageController} = require('../controllers');

const router = express.Router();

router.route('/')
  .post(validate(packageValidation.createPackage), packageController.createPackage)
  .get(validate(packageValidation.getPackages), packageController.getPackages);

router.route('/:packageId')
  .get(validate(packageValidation.getPackage), packageController.getPackage)
  .put(validate(packageValidation.updatePackage), packageController.updatePackage)
  .delete(validate(packageValidation.deletePackage), packageController.deletePackage);


module.exports = router;
