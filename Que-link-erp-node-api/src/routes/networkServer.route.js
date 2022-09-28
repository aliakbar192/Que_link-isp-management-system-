const express = require('express');
const validate = require('../middlewares/validate');
const {networkServerValidation} = require('../validations')
const {networkServerController} = require('../controllers');

const router = express.Router();

router.route('/')
  .post(validate(networkServerValidation.createNetworkServer), networkServerController.createNetworkServer)
  .get(validate(networkServerValidation.getNetworkServers), networkServerController.getNetworkServers);

router.route('/:nasId')
  .get(validate(networkServerValidation.getNetworkServer), networkServerController.getNetworkServer)
  .put(validate(networkServerValidation.updateNetworkServer), networkServerController.updateNetworkServer)
  .delete(validate(networkServerValidation.deleteNetworkServer), networkServerController.deleteNetworkServer);


module.exports = router;
