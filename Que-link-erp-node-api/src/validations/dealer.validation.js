const Joi = require('joi');
const {objectId, password, userName} = require('./custom.validation');

const createDealer = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        franchiseId: Joi.string().required().custom(objectId),
    }),
};

const getDealers = {
    query: Joi.object().keys({
        filter: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getDealer = {
    params: Joi.object().keys({
        dealerId: Joi.string().custom(objectId),
    }),
};

const updateDealer = {
    params: Joi.object().keys({
        dealerId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        franchiseId: Joi.string().custom(objectId),
    })
        .min(1)
};

const deleteDealer = {
    params: Joi.object().keys({
        dealerId: Joi.string().custom(objectId),
    }),
};

const addDealerUser = {
    params: Joi.object().keys({
        dealerId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        userName: Joi.string().required()
    })
        .min(1)
};

const deleteDealerUser = {
    params: Joi.object().keys({
        dealerId: Joi.required().custom(objectId),
        userRoleId: Joi.required().custom(objectId),
    }),
};

module.exports = {
    createDealer,
    getDealers,
    getDealer,
    updateDealer,
    deleteDealer,
    addDealerUser,
    deleteDealerUser
};
