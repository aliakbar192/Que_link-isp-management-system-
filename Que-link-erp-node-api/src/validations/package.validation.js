const Joi = require('joi');
const {objectId, password, userName} = require('./custom.validation');

const createPackage = {
    body: Joi.object().keys({
        packageName: Joi.string().required(),
        profileName: Joi.string().required(),
        billingType: Joi.string().required().valid( 'Prepaid', 'Postpaid' ),
        charges: Joi.number().required(),
        duration: Joi.number().required(),
        durationType: Joi.string().required().valid( 'Year', 'Month', 'Week', 'Day', 'Hour', 'Minute' ),
        dataQuotaVolume: Joi.number().required(),
        dataQuotaVolumeType: Joi.string().required().valid( 'TB', 'GB', 'MB', 'KB' ),
        tenantId: Joi.string().required().custom(objectId),
    }),
};

const getPackages = {
    query: Joi.object().keys({
        filter: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getPackage = {
    params: Joi.object().keys({
        packageId: Joi.string().custom(objectId),
    }),
};

const updatePackage = {
    params: Joi.object().keys({
        packageId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        packageName: Joi.string(),
        profileName: Joi.string(),
        billingType: Joi.string().valid( 'Prepaid', 'Postpaid' ),
        charges: Joi.number(),
        duration: Joi.number(),
        durationType: Joi.string().valid( 'Year', 'Month', 'Week', 'Day', 'Hour', 'Minute' ),
        dataQuotaVolume: Joi.number(),
        dataQuotaVolumeType: Joi.string().valid( 'TB', 'GB', 'MB', 'KB' ),
        tenantId: Joi.string().custom(objectId),
    })
        .min(1)
};

const deletePackage = {
    params: Joi.object().keys({
        packageId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createPackage,
    getPackages,
    getPackage,
    updatePackage,
    deletePackage,
};
