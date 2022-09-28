const sequelize = require('sequelize');
const {httpStatus, message: messages} = require('../utils/constant');
const config = require('./config');
const logger = require('./logger');
const ApiError = require('../utils/ApiError');
const ApiResponse = require("../utils/ApiResponse");
const {environmentTypes} = require("../utils/enum");

module.exports = (app) => {

    // convert error to ApiError, if needed
    app.use((err, req, res, next) => {
        let error = err;
        if (!(error instanceof ApiError)) {
            const statusCode = error.statusCode || error instanceof sequelize.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
            const message = error.message || messages.INTERNAL_SERVER_ERROR;
            error = new ApiError(statusCode, message, false, err.stack);
        }
        next(error);
    });

    // handle error
    app.use((err, req, res, next) => {
        let {statusCode, message} = err;
        if (config.server.env === environmentTypes.DEVELOPMENT && !err.isOperational) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = messages.INTERNAL_SERVER_ERROR;
        }
        res.locals.errorMessage = err.message;
        const error = {
            ...(config.server.env === environmentTypes.DEVELOPMENT && {stack: err.stack}),
        };
        if (config.server.env === environmentTypes.DEVELOPMENT) {
            logger.error(err);
        }
        res.json(new ApiResponse(statusCode, message, error));
    });

}
