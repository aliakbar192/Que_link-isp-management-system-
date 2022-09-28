const {httpStatus, message} = require('../utils/constant');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const objectUtil = require('../utils/objectUtil');
const ApiResponse = require("../utils/ApiResponse");
const {customerService} = require("../services");
const {dealerService} = require("../services");
const { tenantService, userService, userRoleService, networkServerService, packageService, franchiseService } = require('../services');

const createTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.createTenant(req.body);
  res.json(new ApiResponse(httpStatus.CREATED, message.SUCCESS, { tenant: tenant }));
});

const getTenants = catchAsync(async (req, res) => {
  const filter = objectUtil.pick(req.query, ['filter']);
  const options = objectUtil.pick(req.query, ['sortBy', 'limit', 'page']);
  const tenants = await tenantService.queryTenants(filter, options);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenants: tenants }));
});

const getTenant = catchAsync(async (req, res) => {
  let tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const franchises = await franchiseService.getFranchiseByTenantId(req.params.tenantId);
  const dealers = await dealerService.getDealerByTenantId(req.params.tenantId);
  const customers = await customerService.getCustomerByTenantId(req.params.tenantId);
  tenant = {...tenant.toJSON(), franchises: franchises.length, dealers: dealers.length, customers: customers.length};
  console.log(tenant)
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenant: tenant }));
});

const getTenantNetworkServers = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const networkServers = await networkServerService.getNetworkServerByTenantId(tenant.id);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenant: tenant, networkServers: networkServers}));
});

const getTenantPackages = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const packages = await packageService.getPackageByTenantId(tenant.id);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenant: tenant, packages: packages}));
});

const getTenantFranchises = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const franchises = await franchiseService.getFranchiseByTenantId(tenant.id);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenant: tenant, franchises: franchises}));
});

const updateTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.updateTenantById(req.params.tenantId, req.body);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { tenant: tenant }));
});

const deleteTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.deleteTenantById(req.params.tenantId);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { tenant: tenant }));
});

const addTenantUser = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userService.gatUserByUsernameOrEmail(req.body.userName);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const userRole = await userRoleService.createUserRole({userId: user.id, roleId: tenant.id, role: 'tenant'});
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenant: tenant, user: user, userRole: userRole}));
});

const getTenantUsers = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const users = await userRoleService.getUserByRole(tenant.id, 'tenant');
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenant: tenant, users: users}));
});

const deleteTenantUser = catchAsync(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.tenantId);
  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userRoleService.deleteUserRoleById(req.params.userRoleId);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { tenant: tenant, user: user}));
});

module.exports = {
  createTenant,
  getTenants,
  getTenant,
  getTenantNetworkServers,
  getTenantPackages,
  getTenantFranchises,
  updateTenant,
  deleteTenant,
  addTenantUser,
  getTenantUsers,
  deleteTenantUser,
};
