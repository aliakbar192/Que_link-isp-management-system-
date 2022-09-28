const {httpStatus, message} = require('../utils/constant');
const {Tenant} = require('../models');
const ApiError = require('../utils/ApiError');
const {Op} = require("sequelize");

const createTenant = async (tenantBody) => {
    let tenant = await Tenant.findOne(
        {
            where: {
                [Op.or]: [
                    {companyName: tenantBody.companyName},
                ]
            },
            paranoid: false
        }
    );
    if (tenant) {
        if (tenant.companyName === tenantBody.companyName) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Company name already taken');
        }
    }
    tenant = await Tenant.create(tenantBody);
    return tenant;
};

const queryTenants = async (filter, options) => {
    const tenants = await Tenant.findAll();
    return tenants;
};

const getTenantById = async (tenantId) => {
    let tenant = await Tenant.findOne(
        {
            where: {
                id: tenantId
            }
        }
    );
    return tenant;
};

const updateTenantById = async (tenantId, updateTenantBody) => {
    const tenant = await getTenantById(tenantId);
    if (!tenant) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    if (updateTenantBody.companyName) {
        let otherTenantQuery = [];
        if(updateTenantBody.companyName) {
            otherTenantQuery.push({companyName: updateTenantBody.companyName})
        }
        const otherTenant = await Tenant.findOne(
            {
                where: {
                    id: {
                        [Op.ne]: tenant.id
                    },
                    [Op.or]: otherTenantQuery
                },
                paranoid: false
            }
        );
        if (otherTenant) {
            if (updateTenantBody.companyName === otherTenant.companyName) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Company name already taken');
            }
        }
    }
    Object.assign(tenant, updateTenantBody);
    await tenant.save();
    return tenant;
};

const deleteTenantById = async (tenantId) => {
    const tenant = await getTenantById(tenantId);
    if (!tenant) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    await tenant.destroy();
    return tenant;
};

const getTenantByCompanyName = async (companyName) => {
    let tenant = await Tenant.findOne(
        {
            where: {
                companyName: companyName
            }
        }
    );
    return tenant;
};

module.exports = {
    createTenant,
    queryTenants,
    getTenantById,
    updateTenantById,
    deleteTenantById,
    getTenantByCompanyName,
};

