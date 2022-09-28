const catchAsync = require("../utils/catchAsync");
const { httpStatus, message } = require("../utils/constant");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../utils/enum");
const {
	authService,
	userService,
	userRoleService,
	tokenService,
	emailService,
	tenantService,
	franchiseService,
	dealerService,
} = require("../services");
const { getIP, getAgent } = require("../utils/userOriginUtil");

const register = catchAsync(async (req, res) => {
	const user = await authService.registerUser(req.body);
	const tokens = await tokenService.generateAuthTokens(user.id, {
		ip: getIP(req),
		userAgent: getAgent(req),
	});
	res.json(
		new ApiResponse(httpStatus.OK, message.SUCCESS, {
			user: user,
			tokens: tokens,
		})
	);
});

const login = catchAsync(async (req, res) => {
	console.log("acb");
	const user = await authService.loginUserWithEmailAndPassword(
		req.body.email,
		req.body.password
	);
	const tokens = await tokenService.generateAuthTokens(user.id, {
		ip: getIP(req),
		userAgent: getAgent(req),
	});
	let userRoles = await userRoleService.getUserRole(user.id);
	let userRoleData = [];
	for (let i = 0; i < userRoles.length; i++) {
		let newData = userRoles[i].toJSON();
		if (newData.role === "tenant") {
			newData.roleData = await tenantService.getTenantById(newData.roleId);
		} else if (newData.role === "franchise") {
			newData.roleData = await franchiseService.getFranchiseById(
				newData.roleId
			);
		} else if (newData.role === "dealer") {
			newData.roleData = await dealerService.getDealerById(newData.roleId);
		} else {
			newData.roleData = {};
		}
		userRoleData.push(newData);
	}
	res.json(
		new ApiResponse(httpStatus.OK, message.SUCCESS, {
			user: user,
			roles: userRoleData,
			tokens: tokens,
		})
	);
});

const logout = catchAsync(async (req, res) => {
	const tokenData = await tokenService.expireToken(req.body.authToken);
	res.json(
		new ApiResponse(httpStatus.OK, message.SUCCESS, { token: tokenData })
	);
});

const profile = catchAsync(async (req, res) => {
	const user = await userService.getUserById(req.user.id);
	const loginDevices = await tokenService.queryTokens(
		{ userId: user.id, type: tokenTypes.ACCESS },
		null
	);
	res.json(
		new ApiResponse(httpStatus.OK, message.SUCCESS, {
			user: user,
			devices: loginDevices,
		})
	);
});

const changePassword = catchAsync(async (req, res) => {
	const user = await authService.changeUserPassword(
		req.user.id,
		req.body.password,
		req.body.newPassword
	);
	res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { user: user }));
});

const loginDevices = catchAsync(async (req, res) => {
	const loginDevices = await tokenService.queryTokens(
		{ userId: req.user.id, type: tokenTypes.ACCESS },
		null
	);
	res.json(
		new ApiResponse(httpStatus.OK, message.SUCCESS, { devices: loginDevices })
	);
});

const refreshAccessToken = catchAsync(async (req, res) => {
	const token = await tokenService.generateAccessToken(req.body.authToken);
	res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { token: token }));
});

const forgotPassword = catchAsync(async (req, res) => {
	const user = await userService.gatUserByUsernameOrEmail(req.body.email);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
	}
	const { token, key } = await tokenService.generateResetToken(user.id, {
		ip: getIP(req),
		userAgent: getAgent(req),
	});
	await emailService.sendResetPasswordEmail(
		user.firstName,
		user.email,
		key,
		token.token
	);
	res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { token: token }));
});

const resetPassword = catchAsync(async (req, res) => {
	const token = await tokenService.validateToken(
		req.body.resetToken,
		req.body.resetKey
	);
	let user = await authService.resetUserPassword(
		token.userId,
		req.body.password
	);
	await tokenService.expireToken(req.body.resetToken);
	if (req.body.logout) {
		await tokenService.deleteTokens(token.userId, tokenTypes.AUTH, []);
	}
	res.json(new ApiResponse(httpStatus.OK, message.SUCCESS, { user: user }));
});

module.exports = {
	register,
	login,
	logout,
	profile,
	changePassword,
	loginDevices,
	refreshAccessToken,
	forgotPassword,
	resetPassword,
};
