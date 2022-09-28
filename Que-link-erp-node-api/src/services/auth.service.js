const { httpStatus, message} = require('../utils/constant');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

const registerUser = async (userBody) => {
  const user = userService.createUser(userBody);
  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.gatUserByUsernameOrEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, message.INVALID_CREDENTIALS);
  }
  return user;
};

const changeUserPassword = async (userId, password, newPassword) => {
  let user = await userService.getUserById(userId);
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Password');
  }
  user = await userService.updateUserById(userId, {password: newPassword});
  return user;
};

const resetUserPassword = async (userId, password) => {
  const user = await userService.updateUserById(userId, {password: password});
  return user;
};

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
  changeUserPassword,
  resetUserPassword
};
