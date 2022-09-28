const {httpStatus, message} = require('../utils/constant');
const {Dealer, Franchise, Tenant} = require('../models');
const ApiError = require('../utils/ApiError');
const {Op} = require("sequelize");

const createDealer = async (dealerBody) => {
    let dealer = await Dealer.create(dealerBody);
    return dealer;
};

const queryDealers = async (filter, options) => {
    const dealers = await Dealer.findAll(
        {
            include: [
                {
                    model: Franchise,
                    attributes: ['id', 'name', 'tenantId'],
                    include: [
                        {
                            model: Tenant,
                            attributes: ['id', 'companyName'],

                        },
                    ]
                },
            ],
        }
    );
    return dealers;
};

const getDealerById = async (dealerId) => {
    let dealer = await Dealer.findOne(
        {
            include: [
                {
                    model: Franchise,
                    attributes: ['id', 'name', 'tenantId'],
                    include: [
                        {
                            model: Tenant,
                            attributes: ['id', 'companyName'],

                        },
                    ]
                },
            ],
            where: {
                id: dealerId
            }
        }
    );
    return dealer;
};


const getDealerByFranchiseId = async (id) => {
    let dealers = await Dealer.findAll(
        {
            include: [
                {
                    model: Franchise,
                    attributes: ['id', 'name', 'tenantId'],
                    include: [
                        {
                            model: Tenant,
                            attributes: ['id', 'companyName'],

                        },
                    ],
                    where: {
                        id: id
                    }
                },
            ],
        }
    );
    return dealers;
};

const getDealerByTenantId = async (id) => {
    let dealers = await Dealer.findAll(
        {
            include: [
                {
                    model: Franchise,
                    attributes: ['id', 'name', 'tenantId'],
                    include: [
                        {
                            model: Tenant,
                            attributes: ['id', 'companyName'],


                        },
                    ],
                    where: {
                        tenantId: id
                    }
                },
            ],
        }
    );
    return dealers;
};

const updateDealerById = async (dealerId, updateDealerBody) => {
    const dealer = await getDealerById(dealerId);
    if (!dealer) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    Object.assign(dealer, updateDealerBody);
    await dealer.save();
    return dealer;
};

const deleteDealerById = async (dealerId) => {
    const dealer = await getDealerById(dealerId);
    if (!dealer) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    await dealer.destroy();
    return dealer;
};


module.exports = {
    createDealer,
    queryDealers,
    getDealerById,
    getDealerByFranchiseId,
    getDealerByTenantId,
    updateDealerById,
    deleteDealerById,
};

