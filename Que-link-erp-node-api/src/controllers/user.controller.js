const catchAsync = require("../utils/catchAsync");
const { httpStatus, message } = require("../utils/constant");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { userService } = require("../services");
const objectUtil = require("../utils/objectUtil");

const createUser = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	res.json(
		new ApiResponse(httpStatus.CREATED, message.SUCCESS, { user: user })
	);
});

const getUsers = catchAsync(async (req, res) => {
	const filter = objectUtil.pick(req.query, ["filter"]);
	const options = objectUtil.pick(req.query, ["sortBy", "limit", "page"]);
	const users = await userService.queryUsers(filter, options);
	res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { users: users }));
});

const getUser = catchAsync(async (req, res) => {
	const user = await userService.getUserById(req.params.userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
	}
	res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { user: user }));
});

const updateUser = catchAsync(async (req, res) => {
	const user = await userService.updateUserById(req.params.userId, req.body);
	res.json(
		new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { user: user })
	);
});

const deleteUser = catchAsync(async (req, res) => {
	const user = await userService.deleteUserById(req.params.userId);
	res.json(
		new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, { user: user })
	);
});

module.exports = {
	createUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
};
