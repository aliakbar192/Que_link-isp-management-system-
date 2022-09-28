const { httpStatus, message } = require("../utils/constant");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const objectUtil = require("../utils/objectUtil");
const ApiResponse = require("../utils/ApiResponse");
const { networkServerService } = require("../services");
const { billingService } = require("../services");

const createBilling = catchAsync(async (req, res) => {
  const billing = await billingService.createBilling(req.body);
  res.json(
    new ApiResponse(httpStatus.CREATED, message.SUCCESS, { billing: billing })
  );
});

const getBillings = catchAsync(async (req, res) => {
  const filter = objectUtil.pick(req.query, ["filter"]);
  const options = objectUtil.pick(req.query, ["sortBy", "limit", "page"]);
  const billings = await billingService.queryBillings(filter, options);
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, { billings: billings })
  );
});

const getBilling = catchAsync(async (req, res) => {
  const billing = await billingService.getBillingById(req.params.billingId);
  if (!billing) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, { billing: billing })
  );
});
// const getBillingByDealer = catchAsync(async (req, res) => {
//   const billing = await billingService.getBillingByDealerId(
//     req.params.dealerId
//   );
//   if (!billing) {
//     throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
//   }
//   res.json(
//     new ApiResponse(httpStatus.OK, message.SUCCESS, { billing: billing })
//   );
// });

const updateBilling = catchAsync(async (req, res) => {
  const billing = await billingService.updateBillingById(
    req.params.billingId,
    req.body
  );
  res.json(
    new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, {
      billing: billing,
    })
  );
});
const deleteBilling = catchAsync(async (req, res) => {
  const billing = await billingService.deleteBillingById(req.params.billingId);
  res.json(
    new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, {
      billing: billing,
    })
  );
});

module.exports = {
  createBilling,
  getBillings,
  getBilling,
  // getBillingByDealer,
  updateBilling,
  deleteBilling,
};
