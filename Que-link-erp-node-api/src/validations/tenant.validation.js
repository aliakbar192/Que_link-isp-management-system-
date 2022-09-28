const Joi = require('joi');
const {objectId} = require('./custom.validation');

const createTenant = {
    body: Joi.object().keys({
        companyName: Joi.string().required(),
        companySlogan: Joi.string().required(),
        copyrightText: Joi.string().allow(null, ''),
    }),
};

const getTenants = {
    query: Joi.object().keys({
        filter: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getTenant = {
    params: Joi.object().keys({
        tenantId: Joi.string().custom(objectId),
    }),
};

const updateTenant = {
    params: Joi.object().keys({
        tenantId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        companyName: Joi.string(),
        companySlogan: Joi.string(),
        copyrightText: Joi.string(),
    })
        .min(1)
};

const deleteTenant = {
    params: Joi.object().keys({
        tenantId: Joi.string().custom(objectId),
    }),
};

const addTenantUser = {
    params: Joi.object().keys({
        tenantId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        userName: Joi.string().required()
    })
        .min(1)
};

const deleteTenantUser = {
    params: Joi.object().keys({
        tenantId: Joi.required().custom(objectId),
        userRoleId: Joi.required().custom(objectId),
    }),
};

module.exports = {
    createTenant,
    getTenants,
    getTenant,
    updateTenant,
    deleteTenant,
    addTenantUser,
    deleteTenantUser
};
