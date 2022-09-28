const catchAsync = require('../utils/catchAsync');
const {httpStatus, message} = require('../utils/constant');
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const {packageService} = require('../services');
const objectUtil = require('../utils/objectUtil');

const createPackage = catchAsync(async (req, res) => {
  const package = await packageService.createPackage(req.body);
  res.json(new ApiResponse(httpStatus.CREATED, message.SUCCESS, { package: package }));
});

const getPackages = catchAsync(async (req, res) => {
  const filter = objectUtil.pick(req.query, ['filter']);
  const options = objectUtil.pick(req.query, ['sortBy', 'limit', 'page']);
  const packages = await packageService.queryPackages(filter, options);
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { packages: packages }));
});

const getPackage = catchAsync(async (req, res) => {
  const package = await packageService.getPackageById(req.params.packageId);
  if (!package) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { package: package }));
});

const updatePackage = catchAsync(async (req, res) => {
  const package = await packageService.updatePackageById(req.params.packageId, req.body);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { package: package }));
});

const deletePackage = catchAsync(async (req, res) => {
  const package = await packageService.deletePackageById(req.params.packageId);
  res.json(new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { package: package }));
});

module.exports = {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
};
