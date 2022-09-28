const {httpStatus, message} = require('../utils/constant');
const {Franchise, Tenant} = require('../models');
const ApiError = require('../utils/ApiError');
const {Op} = require("sequelize");

const createFranchise = async (franchiseBody) => {
    let franchise = await Franchise.create(franchiseBody);
    return franchise;
};

const queryFranchises = async (filter, options) => {
    const franchises = await Franchise.findAll(
        {
            include: [
                {
                    model: Tenant,
                    attributes: ['id', 'companyName']
                },
            ],
        }
    );
    return franchises;
};

const getFranchiseById = async (franchiseId) => {
    let franchise = await Franchise.findOne(
        {
            include: [
                {
                    model: Tenant ,
                    attributes: ['id', 'companyName']
                },
            ],
            where: {
                id: franchiseId
            }
        }
    );
    return franchise;
};


const getFranchiseByTenantId = async (id) => {
    let franchise = await Franchise.findAll(
        {
            include: [
                {
                    model: Tenant ,
                    attributes: ['id', 'companyName'],

                },
            ],
            where: {
                tenantId: id
            }
        }
    );
    return franchise;
};

const updateFranchiseById = async (franchiseId, updateFranchiseBody) => {
    const franchise = await getFranchiseById(franchiseId);
    if (!franchise) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    Object.assign(franchise, updateFranchiseBody);
    await franchise.save();
    return franchise;
};

const deleteFranchiseById = async (franchiseId) => {
    const franchise = await getFranchiseById(franchiseId);
    if (!franchise) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    await franchise.destroy();
    return franchise;
};


module.exports = {
    createFranchise,
    queryFranchises,
    getFranchiseById,
    getFranchiseByTenantId,
    updateFranchiseById,
    deleteFranchiseById,
};

