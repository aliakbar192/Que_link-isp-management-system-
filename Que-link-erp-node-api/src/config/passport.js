const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const config = require('./config');
const ApiError = require("../utils/ApiError");
const {httpStatus, message} = require("../utils/constant");
const {userService} = require("../services");
const {tokenTypes} = require('../utils/enum');

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        if (!payload.type || payload.type !== tokenTypes.ACCESS) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
        }
        const user = await userService.getUserById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};
