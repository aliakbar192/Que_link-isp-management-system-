const express = require('express');
const validate = require('../middlewares/validate');
const {tenantValidation} = require('../validations');
const {tenantController} = require('../controllers');

const router = express.Router();

router.route('/')
  .post(validate(tenantValidation.createTenant), tenantController.createTenant)
  .get(validate(tenantValidation.getTenants), tenantController.getTenants);

router.route('/:tenantId/network-server')
    .get(validate(tenantValidation.getTenant), tenantController.getTenantNetworkServers)

router.route('/:tenantId/package')
    .get(validate(tenantValidation.getTenant), tenantController.getTenantPackages)

router.route('/:tenantId/franchise')
    .get(validate(tenantValidation.getTenant), tenantController.getTenantFranchises)

router.route('/:tenantId')
  .get(validate(tenantValidation.getTenant), tenantController.getTenant)
  .put(validate(tenantValidation.updateTenant), tenantController.updateTenant)
  .delete(validate(tenantValidation.deleteTenant), tenantController.deleteTenant);

router.route('/:tenantId/user')
    .get(validate(tenantValidation.getTenant), tenantController.getTenantUsers)
    .post(validate(tenantValidation.addTenantUser), tenantController.addTenantUser);

router.route('/:tenantId/user/:userRoleId')
    .delete(validate(tenantValidation.deleteTenantUser), tenantController.deleteTenantUser);

module.exports = router;
