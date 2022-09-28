const catchAsync = require("../utils/catchAsync");
const { httpStatus, message } = require("../utils/constant");
const ApiResponse = require("../utils/ApiResponse");
const { customerSubscriptionService } = require("../services");
const { getIP, getAgent } = require("../utils/userOriginUtil");

const connection = catchAsync(async (req, res) => {
  console.log(req);
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      message: "connection Successful",
    })
  );
});

// const connectionPost = catchAsync(async (req, res) => {
// 	const region = await areaService.createRegion(req.body);
// 	res.json(
// 		new ApiResponse(httpStatus.CREATED, message.SUCCESS, { region: region })
// 	);
// });

const auth = catchAsync(async (req, res) => {
  console.log(req);
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      message: "connection Successful",
    })
  );
});

const requestInfo = catchAsync(async (req, res) => {
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      ip: getIP(req),
      agent: getAgent(req),
    })
  );
});

const syncCustomerSubscriptions = catchAsync(async (req, res) => {
  let customerSubscription =
    await customerSubscriptionService.syncCustomerSubscriptions();
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      synced: customerSubscription,
    })
  );
});

module.exports = {
  connection,
  auth,
  requestInfo,
  syncCustomerSubscriptions,
};
