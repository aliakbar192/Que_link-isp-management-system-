const Joi = require('joi');
const {objectId, password, userName} = require('./custom.validation');

const createFranchise = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        networkServerId: Joi.string().required().custom(objectId),
        tenantId: Joi.string().required().custom(objectId),
    }),
};

const getFranchises = {
    query: Joi.object().keys({
        filter: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getFranchise = {
    params: Joi.object().keys({
        franchiseId: Joi.string().custom(objectId),
    }),
};

const updateFranchise = {
    params: Joi.object().keys({
        franchiseId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        networkServerId: Joi.string().custom(objectId),
        tenantId: Joi.string().custom(objectId),
    })
        .min(1)
};

const deleteFranchise = {
    params: Joi.object().keys({
        franchiseId: Joi.string().custom(objectId),
    }),
};

const addFranchiseUser = {
    params: Joi.object().keys({
        franchiseId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        userName: Joi.string().required()
    })
        .min(1)
};

const deleteFranchiseUser = {
    params: Joi.object().keys({
        franchiseId: Joi.required().custom(objectId),
        userRoleId: Joi.required().custom(objectId),
    }),
};

module.exports = {
    createFranchise,
    getFranchises,
    getFranchise,
    updateFranchise,
    deleteFranchise,
    addFranchiseUser,
    deleteFranchiseUser
};
