const { httpStatus, message } = require("../utils/constant");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const createUser = async (userBody) => {
  let user = await User.findOne({
    where: {
      [Op.or]: [{ email: userBody.email }, { userName: userBody.userName }],
    },
    paranoid: false,
  });
  if (user) {
    if (user.userName === userBody.userName) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
    } else if (user.email === userBody.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
  }
  user = await User.create(userBody);
  return user;
};

const queryUsers = async (filter, options) => {
  const users = await User.findAll();
  return users;
};

const getUserById = async (userId) => {
  let user = await User.findOne({
    where: {
      id: userId,
    },
  });
  return user;
};

const updateUserById = async (userId, updateUserBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  if (updateUserBody.email || updateUserBody.userName) {
    let otherUserQuery = [];
    if (updateUserBody.email) {
      otherUserQuery.push({ email: updateUserBody.email });
    }
    if (updateUserBody.userName) {
      otherUserQuery.push({ userName: updateUserBody.userName });
    }
    const otherUser = await User.findOne({
      where: {
        id: {
          [Op.ne]: user.id,
        },
        [Op.or]: otherUserQuery,
      },
      paranoid: false,
    });
    if (otherUser) {
      if (updateUserBody.userName === otherUser.userName) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
      } else if (updateUserBody.email === otherUser.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
      }
    }
  }
  Object.assign(user, updateUserBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  await user.destroy();
  return user;
};

const gatUserByUsernameOrEmail = async (emailOrUserName) => {
  let users = await User.findOne({
    where: {
      [Op.or]: [{ email: emailOrUserName }, { userName: emailOrUserName }],
    },
  });
  return users;
};

const getUserByUserName = async (userName) => {
  let user = await User.findOne({
    where: {
      userName: userName,
    },
  });
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByUserName,
  gatUserByUsernameOrEmail,
};
