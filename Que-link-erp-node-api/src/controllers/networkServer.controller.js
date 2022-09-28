const {httpStatus, message} = require('../utils/constant');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const objectUtil = require('../utils/objectUtil');
const ApiResponse = require("../utils/ApiResponse");
const { networkServerService } = require('../services');

const createNetworkServer = catchAsync(async (req, res) => {
  const networkServer = await networkServerService.createNetworkServer(req.body);
  res.json(new ApiResponse(httpStatus.CREATED, message.SUCCESS, { networkServer: networkServer }));
});

const getNetworkServers = catchAsync(async (req, res) => {
  const filter = objectUtil.pick(req.query, ['filter']);
  const options = objectUtil.pick(req.query, ['sortBy', 'limit', 'page']);
  const networkServers = await networkServerService.queryNetworkServers(filter, options);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { networkServers: networkServers }));
});

const getNetworkServer = catchAsync(async (req, res) => {
  const networkServer = await networkServerService.getNetworkServerById(req.params.nasId);
  if (!networkServer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { networkServer: networkServer }));
});

const updateNetworkServer = catchAsync(async (req, res) => {
  const networkServer = await networkServerService.updateNetworkServerById(req.params.nasId, req.body);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { networkServer: networkServer }));
});

const deleteNetworkServer = catchAsync(async (req, res) => {
  const networkServer = await networkServerService.deleteNetworkServerById(req.params.nasId);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { networkServer: networkServer }));
});

module.exports = {
  createNetworkServer,
  getNetworkServers,
  getNetworkServer,
  updateNetworkServer,
  deleteNetworkServer,
};
