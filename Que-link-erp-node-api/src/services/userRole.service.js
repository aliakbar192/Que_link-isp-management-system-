const {httpStatus, message} = require('../utils/constant');
const {UserRole, User} = require('../models');
const ApiError = require('../utils/ApiError');
const {Op} = require("sequelize");

const createUserRole = async (userRoleBody) => {
    let userRoles = await getUserRole(userRoleBody.userId);
    if(userRoles.length !== 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User Already attached with some role");
    }
    let userRole = await UserRole.create(userRoleBody);
    return userRole;
};

const getUserRoleById = async (userRoleId) => {
    let userRole = await UserRole.findOne(
        {
            include: [
                {
                    model: User ,
                },
            ],
            where: {
                id: userRoleId
            }
        }
    );
    return userRole;
};

const getUserByRole = async (roleId, role) => {
    let user = await UserRole.findAll(
        {
            include: [
                {
                    model: User ,
                },
            ],
            where: {
                roleId: roleId,
                role: role
            }
        }
    );
    return user;
};

const getUserRole = async (userId) => {
    let user = await UserRole.findAll(
        {
            include: [
                {
                    model: User ,
                },
            ],
            where: {
                userId: userId,
            }
        }
    );
    return user;
};

const deleteUserRoleById = async (userRoleId) => {
    const userRole = await getUserRoleById(userRoleId);
    if (!userRole) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    await userRole.destroy();
    return userRole;
};

module.exports = {
    createUserRole,
    getUserRoleById,
    getUserRole,
    getUserByRole,
    deleteUserRoleById,
};

