const { httpStatus, message } = require("../utils/constant");
const {
  Customer,
  Dealer,
  Franchise,
  Tenant,
  CustomerSubscription,
  Package,
} = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const createCustomer = async (customerBody) => {
  let customer = await Customer.create(customerBody);
  return customer;
};

const queryCustomers = async (filter, options) => {
  const customers = await Customer.findAll({
    include: [
      {
        model: Package,
        attributes: ["id", "packageName"],
        model: Dealer,
        attributes: ["id", "name", "franchiseId"],
        include: [
          {
            model: Franchise,
            attributes: ["id", "name", "tenantId"],
            include: [
              {
                model: Tenant,
                attributes: ["id", "companyName"],
              },
            ],
          },
        ],
      },
      // {
      //   model: Package,
      //   attributes: ["id", "packageName"],
      // },

      {
        model: CustomerSubscription,
      },
    ],
  });
  return customers;
};

const getCustomerById = async (customerId) => {
  let customer = await Customer.findOne({
    include: [
      {
        model: Package,
        attributes: ["id", "profileName"],
        model: Dealer,
        attributes: ["id", "name", "franchiseId"],
        include: [
          {
            model: Franchise,
            attributes: ["id", "name", "tenantId"],
            include: [
              {
                model: Tenant,
                attributes: ["id", "companyName"],
              },
            ],
          },
        ],
      },
    ],
    where: {
      id: customerId,
    },
  });
  return customer;
};

const getCustomerByDealerId = async (id) => {
  let customers = await Customer.findAll({
    include: [
      {
        model: Dealer,
        attributes: ["id", "name", "franchiseId"],
        include: [
          {
            model: Franchise,
            attributes: ["id", "name", "tenantId"],
            include: [
              {
                model: Tenant,
                attributes: ["id", "companyName"],
              },
            ],
          },
        ],
        where: {
          id: id,
        },
      },
    ],
  });
  return customers;
};

const getCustomerByFranchiseId = async (id) => {
  let customers = await Customer.findAll({
    include: [
      {
        model: Dealer,
        attributes: ["id", "name", "franchiseId"],
        include: [
          {
            model: Franchise,
            attributes: ["id", "name", "tenantId"],
            include: [
              {
                model: Tenant,
                attributes: ["id", "companyName"],
              },
            ],
            where: {
              id: id,
            },
          },
        ],
      },
    ],
  });
  return customers;
};

const getCustomerByTenantId = async (id) => {
  let customers = await Customer.findAll({
    include: [
      {
        model: Dealer,
        attributes: ["id", "name", "franchiseId"],
        include: [
          {
            model: Franchise,
            attributes: ["id", "name", "tenantId"],
            include: [
              {
                model: Tenant,
                attributes: ["id", "companyName"],
              },
            ],
            where: {
              id: id,
            },
          },
        ],
      },
    ],
  });
  return customers;
};

const updateCustomerById = async (customerId, updateCustomerBody) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  Object.assign(customer, updateCustomerBody);
  await customer.save();
  return customer;
};

const deleteCustomerById = async (customerId) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  await customer.destroy();
  return customer;
};

module.exports = {
  createCustomer,
  queryCustomers,
  getCustomerById,
  getCustomerByDealerId,
  getCustomerByFranchiseId,
  getCustomerByTenantId,
  updateCustomerById,
  deleteCustomerById,
};
