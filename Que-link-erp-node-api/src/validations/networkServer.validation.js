const Joi = require('joi');
const {objectId, ipAddress, ipPort} = require('./custom.validation');

const createNetworkServer = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        userName: Joi.string().required(),
        password: Joi.string().required(),
        secret: Joi.string(),
        ipAddress: Joi.string().required().custom(ipAddress),
        port: Joi.string().required().custom(ipPort),
        apiPort: Joi.string().custom(ipPort),
        tenantId: Joi.string().required().custom(objectId),
    }),
};

const getNetworkServers = {
    query: Joi.object().keys({
        filter: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getNetworkServer = {
    params: Joi.object().keys({
        nasId: Joi.string().custom(objectId),
    }),
};

const updateNetworkServer = {
    params: Joi.object().keys({
        nasId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        userName: Joi.string(),
        password: Joi.string(),
        secret: Joi.string(),
        ipAddress: Joi.string(),
        port: Joi.string(),
        apiPort: Joi.string(),
        tenantId: Joi.string().custom(objectId),
    })
        .min(1)
};

const deleteNetworkServer = {
    params: Joi.object().keys({
        nasId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createNetworkServer,
    getNetworkServers,
    getNetworkServer,
    updateNetworkServer,
    deleteNetworkServer,
};
