const {httpStatus, message} = require('../utils/constant');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const objectUtil = require('../utils/objectUtil');
const ApiResponse = require("../utils/ApiResponse");
const {customerService} = require("../services");
const { franchiseService, dealerService, userService, userRoleService } = require('../services');

const createFranchise = catchAsync(async (req, res) => {
  const franchise = await franchiseService.createFranchise(req.body);
  res.json(new ApiResponse(httpStatus.CREATED, message.SUCCESS, { franchise: franchise }));
});

const getFranchises = catchAsync(async (req, res) => {
  const filter = objectUtil.pick(req.query, ['filter']);
  const options = objectUtil.pick(req.query, ['sortBy', 'limit', 'page']);
  const franchises = await franchiseService.queryFranchises(filter, options);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { franchises: franchises }));
});

const getFranchise = catchAsync(async (req, res) => {
  let franchise = await franchiseService.getFranchiseById(req.params.franchiseId);
  if (!franchise) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const dealers = await dealerService.getDealerByFranchiseId(req.params.franchiseId);
  const customers = await customerService.getCustomerByDealerId(req.params.franchiseId);
  franchise = {...franchise.toJSON(), dealers: dealers.length, customers: customers.length};
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { franchise: franchise }));
});

const getFranchiseDealers = catchAsync(async (req, res) => {
  const franchise = await franchiseService.getFranchiseById(req.params.franchiseId);
  if (!franchise) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const dealers = await dealerService.getDealerByFranchiseId(req.params.franchiseId);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { franchise: franchise, dealers: dealers }));
});

const updateFranchise = catchAsync(async (req, res) => {
  const franchise = await franchiseService.updateFranchiseById(req.params.franchiseId, req.body);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { franchise: franchise }));
});

const deleteFranchise = catchAsync(async (req, res) => {
  const franchise = await franchiseService.deleteFranchiseById(req.params.franchiseId);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { franchise: franchise }));
});

const addFranchiseUser = catchAsync(async (req, res) => {
  const franchise = await franchiseService.getFranchiseById(req.params.franchiseId);
  if (!franchise) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userService.gatUserByUsernameOrEmail(req.body.userName);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const userRole = await userRoleService.createUserRole({userId: user.id, roleId: franchise.id, role: 'franchise'});
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { franchise: franchise, user: user, userRole: userRole}));
});

const getFranchiseUsers = catchAsync(async (req, res) => {
  const franchise = await franchiseService.getFranchiseById(req.params.franchiseId);
  if (!franchise) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const users = await userRoleService.getUserByRole(franchise.id, 'franchise');
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { franchise: franchise, users: users}));
});

const deleteFranchiseUser = catchAsync(async (req, res) => {
  const franchise = await franchiseService.getFranchiseById(req.params.franchiseId);
  if (!franchise) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userRoleService.deleteUserRoleById(req.params.userRoleId);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { franchise: franchise, user: user}));
});

module.exports = {
  createFranchise,
  getFranchises,
  getFranchise,
  getFranchiseDealers,
  updateFranchise,
  deleteFranchise,
  addFranchiseUser,
  getFranchiseUsers,
  deleteFranchiseUser,
};
