const Joi = require('joi');
const {password, userName} = require('./custom.validation');

const register = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        userName: Joi.string().required().custom(userName),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

const logout = {
    body: Joi.object().keys({
        authToken: Joi.string().required(),
    }),
};

const profile = {
    body: Joi.object().keys({
    }),
};

const changePassword = {
    body: Joi.object().keys({
        password: Joi.string().required(),
        newPassword: Joi.string().required().custom(password),
    }),
};

const loginDevices = {
    body: Joi.object().keys({
    }),
};

const refreshAccessToken = {
    body: Joi.object().keys({
        authToken: Joi.string().required(),
    }),
};

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

const resetPassword = {
    body: Joi.object().keys({
        resetToken: Joi.string().required(),
        resetKey: Joi.string().required().length(6),
        password: Joi.string().required().custom(password),
        logout: Joi.boolean().required(),
    }),
};

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
