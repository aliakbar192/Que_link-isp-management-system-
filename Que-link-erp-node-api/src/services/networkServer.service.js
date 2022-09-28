const {httpStatus, message} = require('../utils/constant');
const {NetworkServer, Tenant} = require('../models');
const ApiError = require('../utils/ApiError');
const franchiseService = require("../services/franchise.service");
const dealerService = require("../services/dealer.service");
const customerService = require("../services/customer.service");

const createNetworkServer = async (userBody) => {
    let networkServer = await NetworkServer.create(userBody);
    return networkServer;
};

const queryNetworkServers = async (filter, options) => {
    const networkServers = await NetworkServer.findAll(
        {
            include: [
                {
                    model: Tenant ,
                    attributes: ['id', 'companyName']
                },
            ],
        }
    );
    return networkServers;
};

const getNetworkServerById = async (id) => {
    let networkServer = await NetworkServer.findOne(
        {
            include: [
                {
                    model: Tenant ,
                    attributes: ['id', 'companyName']
                },
            ],
            where: {
                id: id
            }
        }
    );
    return networkServer;
};

const getNetworkServerByTenantId = async (id) => {
    let networkServer = await NetworkServer.findAll(
        {
            include: [
                {
                    model: Tenant ,
                    attributes: ['id', 'companyName']
                },
            ],
            where: {
                tenantId: id
            }
        }
    );
    return networkServer;
};

const updateNetworkServerById = async (networkServerId, updateBody) => {
    const networkServer = await getNetworkServerById(networkServerId);
    if (!networkServer) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    Object.assign(networkServer, updateBody);
    await networkServer.save();
    return networkServer;
};

const deleteNetworkServerById = async (networkServerId) => {
    const networkServer = await getNetworkServerById(networkServerId);
    if (!networkServer) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    await networkServer.destroy();
    return networkServer;
};

const getNetworkServerByFranchiseId = async (franchiseId) => {
    const franchise = await franchiseService.getFranchiseById(franchiseId);
    if (!franchise) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    return getNetworkServerById(franchise.networkServerId);
};

const getNetworkServerByDealerId = async (dealerId) => {
    const dealer = await dealerService.getDealerById(dealerId);
    if (!dealer) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    return getNetworkServerByFranchiseId(dealer.franchiseId);
};

const getNetworkServerByCustomerId = async (customerId) => {
    const customer = await customerService.getCustomerById(customerId);
    if (!customer) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    return getNetworkServerByDealerId(customer.dealerId);
};

module.exports = {
    createNetworkServer,
    queryNetworkServers,
    getNetworkServerById,
    getNetworkServerByTenantId,
    updateNetworkServerById,
    deleteNetworkServerById,
    getNetworkServerByFranchiseId,
    getNetworkServerByDealerId,
    getNetworkServerByCustomerId
};
