const express = require('express');
const validate = require('../middlewares/validate');
const {} = require('../validations');
const {adminController} = require('../controllers');

const router = express.Router();

router.route('/:adminId')
  .get(adminController.getAdmin)

module.exports = router;
