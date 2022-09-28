const {httpStatus, message} = require('../utils/constant');
const {CustomerSubscription, Customer, Package} = require('../models');
const ApiError = require('../utils/ApiError');
const {Op} = require("sequelize");
const {packageService} = require('../services');
const moment = require('moment');
const mikrotikService = require("./mikrotik.service");
const {networkServerService} = require("./index");

const createCustomerSubscription = async (customerSubscriptionBody, nasRef) => {
    const {customerId, packageId} = customerSubscriptionBody;
    const package = await packageService.getPackageById(packageId);
    if (!package) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    const subscriptionTimeStart = moment().toDate();
    const subscriptionTimeExpire = moment().add(Number(package.duration), package.durationType.toLowerCase()).toDate();
    let customerSubscription = await CustomerSubscription.create({customerId: customerId, packageId: package.id, startAt: subscriptionTimeStart, endAt: subscriptionTimeExpire, payable: package.charges, paid: package.charges, nasRef: nasRef});
    return customerSubscription;
};

const queryCustomerSubscriptions = async (filter, options) => {
    const customerSubscriptions = await CustomerSubscription.findAll();
    return customerSubscriptions;
};

const getCustomerSubscriptionById = async (customerSubscriptionId) => {
    let customerSubscription = await CustomerSubscription.findOne(
        {
            where: {
                id: customerSubscriptionId
            }
        }
    );
    return customerSubscription;
};

const getCustomerSubscriptionsByCustomerId = async (customerId) => {
    let customerSubscriptions = await CustomerSubscription.findAll(
        {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'userName', 'packageId:', 'onExpire'],
                },
                {
                    model: Package,
                    attributes: ['id', 'packageName', 'profileName', 'billingType', 'charges', 'duration', 'durationType']
                },
            ],
            where: {
                customerId: customerId
            }
        }
    );
    return customerSubscriptions;
};

const deleteCustomerSubscriptionsById = async (customerSubscriptionId) => {
    const customerSubscription = await getCustomerSubscriptionById(customerSubscriptionId);
    if (!customerSubscription) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    await customerSubscription.destroy();
    return customerSubscription;
};

const syncCustomerSubscriptions = async () => {
    let customerSubscriptionsInvalid = await CustomerSubscription.findAll(
        {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'userName', 'secret', 'packageId', 'onExpire'],
                },
                {
                    model: Package,
                    attributes: ['id', 'packageName', 'profileName', 'billingType', 'charges', 'duration', 'durationType']
                },
            ],
            where: {
                endAt: {
                    [Op.lte]: moment().toDate(),
                },
            }
        }
    );
    for (let i = 0; i< customerSubscriptionsInvalid.length; i++) {
        try {
            let invalidSubscription = customerSubscriptionsInvalid[i];
            const networkServer = await networkServerService.getNetworkServerByCustomerId(invalidSubscription.customer.id);
            if (!networkServer) {
                continue;
            }
            const nasClient = {
                name: invalidSubscription.customer.userName,
                password: invalidSubscription.customer.secret,
                profile: invalidSubscription.package.profileName
            };
            const nasServer = {
                id: networkServer.id,
                ip: networkServer.ipAddress,
                name: networkServer.userName,
                password: networkServer.password
            };
            let pppoeUser = await mikrotikService.removeMikrotikApiUser(nasServer, nasClient);
            console.log('--------------------Removing-------------------')
            console.log(nasClient);
            console.log(nasServer);
            console.log(pppoeUser);
            console.log('------------------------------------------------')
        }catch (e){
            console.log(e)
        }
    }


    let customerSubscriptionsValid = await CustomerSubscription.findAll(
        {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'userName', 'secret', 'packageId', 'onExpire'],
                },
                {
                    model: Package,
                    attributes: ['id', 'packageName', 'profileName', 'billingType', 'charges', 'duration', 'durationType']
                },
            ],
            where: {
                endAt: {
                    [Op.gt]: moment().toDate(),
                },
                startAt: {
                    [Op.lte]: moment().toDate()
                }
            }
        }
    );
    for (let i = 0; i< customerSubscriptionsValid.length; i++) {
        try {
            let validSubscription = customerSubscriptionsValid[i];
            const networkServer = await networkServerService.getNetworkServerByCustomerId(validSubscription.customer.id);
            if (!networkServer) {
                continue;
            }
            const nasClient = {
                name: validSubscription.customer.userName,
                password: validSubscription.customer.secret,
                profile: validSubscription.package.profileName
            };
            const nasServer = {
                id: networkServer.id,
                ip: networkServer.ipAddress,
                name: networkServer.userName,
                password: networkServer.password
            };
            let pppoeUser = await mikrotikService.addMikrotikApiUser(nasServer, nasClient);
            console.log('---------------------Adding--------------------')
            console.log(nasClient);
            console.log(nasServer);
            console.log(pppoeUser);
            console.log('------------------------------------------------')
        }catch (e){
            console.log(e)
        }
    }

    return true;
};

module.exports = {
    createCustomerSubscription,
    queryCustomerSubscriptions,
    getCustomerSubscriptionById,
    getCustomerSubscriptionsByCustomerId,
    deleteCustomerSubscriptionsById,
    syncCustomerSubscriptions
};
