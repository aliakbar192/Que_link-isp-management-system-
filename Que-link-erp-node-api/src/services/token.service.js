const {httpStatus, message} = require('../utils/constant');
const {User} = require('../models');
const ApiError = require('../utils/ApiError');
const {Op} = require("sequelize");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const {Token} = require('../models');
const {tokenTypes} = require('../utils/enum')

const createToken = async (userId, token, key, type, expires, device) => {
    const tokens = await Token.create({
        userId: userId,
        token: token,
        key: key,
        type: type,
        lastSeenAt: moment().toDate(),
        expiresAt: expires.toDate(),
        ipAddress: device ? device.ip || null : null,
        userAgent: device ? device.userAgent || null : null,
    });
    return tokens;
};

const getToken = async (token) => {
    let payload;
    jwt.verify(token, config.jwt.secret, function(err, decoded) {
        if (err) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Invalid or Expired Token');
        }
        else {
            payload = decoded;
        }
    });
    const tokenData = await Token.findOne(
        {
            where: {
                userId: payload.sub,
                token: token,
                logoutAt: null,
                expiresAt: {
                    [Op.gt]: moment().toDate()
                },
            }
        }
    );
    if (!tokenData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid or Expired Token');
    }
    return tokenData;
};

const queryTokens = async (filter, options) => {
    const where =  {
            userId: filter.userId,
            type: filter.type | { [Op.ne]: null },
            logoutAt: null,
            expiresAt: {
                [Op.gt]: moment().toDate()
            },
        };
    const tokenData = await Token.findAll(
        {where}
    );
    return tokenData;
};

const expireToken = async (token) => {
    const tokenData = await getToken(token);
    console.log(tokenData)
    Object.assign(tokenData, {logoutAt: moment().toDate()});
    await tokenData.save();
    return {
        auth: {
            token: tokenData.token,
            expires: tokenData.logoutAt,
        }
    };
};

const deleteTokens = async (userId, type,  exceptions = []) => {
    const tokenData = await Token.destroy(
        {
            where: {
                userId: userId,
                token: { [Op.notIn]: exceptions },
                type:  type? type: { [Op.ne]: null },
                logoutAt: null,
                expiresAt: {
                    [Op.gt]: moment().toDate(),
                },
            }
        }
    );
    return tokenData;
};

const validateToken = async (token, key) => {
    const tokenData = await getToken(token);
    const keyMatched = await tokenData.isKeyMatch(key);
    if (!keyMatched) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired Key');
    }
    return tokenData;
};



const generateAuthTokens = async (userId, device) => {

    const authTokenExpires = moment().add(config.jwt.authExpireTime, 'minutes');
    const authToken = generateToken(userId, authTokenExpires, tokenTypes.AUTH);

    const accessTokenExpires = moment().add(config.jwt.accessExpireTime, 'minutes');
    const accessToken = generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);

    await createToken(userId, authToken, null, tokenTypes.AUTH, authTokenExpires, device);

    return {
        auth: {
            token: authToken,
            expires: authTokenExpires.toDate(),
        },
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
    };
};

const generateAccessToken = async (token) => {

    const tokenData = await getToken(token);
    if(tokenData.type != tokenTypes.AUTH){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }

    const accessTokenExpires = moment().add(config.jwt.accessExpireTime, 'minutes');
    const accessToken = generateToken(tokenData.userId, accessTokenExpires, tokenTypes.ACCESS);

    Object.assign(tokenData, {lastSeenAt: moment().toDate()});
    await tokenData.save();

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
    };
};

const generateResetToken = async (userId, device) => {

    const resetTokenExpires = moment().add(config.jwt.resetExpireTime, 'minutes');
    const resetToken = generateToken(userId, resetTokenExpires, tokenTypes.RESET);
    const resetKey = Math.floor(100000 + Math.random() * 900000);

    await createToken(userId, resetToken, resetKey, tokenTypes.RESET, resetTokenExpires, device);
    await deleteTokens(userId, tokenTypes.RESET, [resetToken]);

    return {
        token: {
            reset: {
                token: resetToken,
                expires: resetTokenExpires.toDate(),
            },
        },
        key: resetKey,
    };
};

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        type: type,
        iat: moment().unix(),
        exp: expires.unix(),
    };
    return jwt.sign(payload, secret);
};


module.exports = {
    createToken,
    queryTokens,
    getToken,
    expireToken,
    deleteTokens,
    validateToken,
    generateAuthTokens,
    generateAccessToken,
    generateResetToken
};
