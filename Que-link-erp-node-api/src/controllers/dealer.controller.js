const { httpStatus, message } = require("../utils/constant");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const objectUtil = require("../utils/objectUtil");
const ApiResponse = require("../utils/ApiResponse");
const {
  dealerService,
  customerService,
  userService,
  userRoleService,
} = require("../services");

const createDealer = catchAsync(async (req, res) => {
  const dealer = await dealerService.createDealer(req.body);
  res.json(
    new ApiResponse(httpStatus.CREATED, message.SUCCESS, { dealer: dealer })
  );
});

const getDealers = catchAsync(async (req, res) => {
  const filter = objectUtil.pick(req.query, ["filter"]);
  const options = objectUtil.pick(req.query, ["sortBy", "limit", "page"]);
  const dealers = await dealerService.queryDealers(filter, options);
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, { dealers: dealers })
  );
});

const getDealer = catchAsync(async (req, res) => {
  let dealer = await dealerService.getDealerById(req.params.dealerId);
  if (!dealer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const customers = await customerService.getCustomerByDealerId(
    req.params.dealerId
  );
  dealer = { ...dealer.toJSON(), customers: customers.length };
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { dealer: dealer }));
});

const getDealerCustomers = catchAsync(async (req, res) => {
  const dealer = await dealerService.getDealerById(req.params.dealerId);
  if (!dealer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const customers = await customerService.getCustomerByDealerId(
    req.params.dealerId
  );
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      dealer: dealer,
      customers: customers,
    })
  );
});

const updateDealer = catchAsync(async (req, res) => {
  const dealer = await dealerService.updateDealerById(
    req.params.dealerId,
    req.body
  );
  res.json(
    new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { dealer: dealer })
  );
});

const deleteDealer = catchAsync(async (req, res) => {
  const dealer = await dealerService.deleteDealerById(req.params.dealerId);
  res.json(
    new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { dealer: dealer })
  );
});

const addDealerUser = catchAsync(async (req, res) => {
  const dealer = await dealerService.getDealerById(req.params.dealerId);
  if (!dealer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userService.gatUserByUsernameOrEmail(req.body.userName);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const userRole = await userRoleService.createUserRole({
    userId: user.id,
    roleId: dealer.id,
    role: "dealer",
  });
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      dealer: dealer,
      user: user,
      userRole: userRole,
    })
  );
});

const getDealerUsers = catchAsync(async (req, res) => {
  const dealer = await dealerService.getDealerById(req.params.dealerId);
  if (!dealer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const users = await userRoleService.getUserByRole(dealer.id, "dealer");
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      dealer: dealer,
      users: users,
    })
  );
});

const deleteDealerUser = catchAsync(async (req, res) => {
  const dealer = await dealerService.getDealerById(req.params.dealerId);
  if (!dealer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userRoleService.deleteUserRoleById(req.params.userRoleId);
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      dealer: dealer,
      user: user,
    })
  );
});

module.exports = {
  createDealer,
  getDealers,
  getDealer,
  getDealerCustomers,
  updateDealer,
  deleteDealer,
  addDealerUser,
  getDealerUsers,
  deleteDealerUser,
};
