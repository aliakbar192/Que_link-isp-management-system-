const Joi = require("joi");
const { objectId, password, userName } = require("./custom.validation");

const createCustomer = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    nicNo: Joi.string().allow(null, ""),
    email: Joi.string().email().allow(null, ""),
    phoneNo: Joi.string().allow(null, ""),
    dealerId: Joi.string().required().custom(objectId),
    userName: Joi.string().required(),
    secret: Joi.string().required(),
    connectionType: Joi.string()
      .required()
      .valid("Fiber", "Ethernet", "Hotspot"),
    packageId: Joi.string().required().custom(objectId),
    onExpire: Joi.string().required().valid("AutoRenew", "Expire"),
  }),
};

const getCustomers = {
  query: Joi.object().keys({
    filter: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
};

const updateCustomer = {
  params: Joi.object().keys({
    customerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      nicNo: Joi.string().allow(null, ""),
      email: Joi.string().email().allow(null, ""),
      phoneNo: Joi.string().allow(null, ""),
      dealerId: Joi.string().custom(objectId),
      userName: Joi.string(),
      secret: Joi.string(),
      connectionType: Joi.string().valid("Fiber", "Ethernet", "Hotspot"),
      packageId: Joi.string().custom(objectId),
      onExpire: Joi.string().valid("AutoRenew", "Expire"),
    })
    .min(1),
};

const deleteCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
};

const addCustomerUser = {
  params: Joi.object().keys({
    customerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userName: Joi.string().required(),
    })
    .min(1),
};

const deleteCustomerUser = {
  params: Joi.object().keys({
    customerId: Joi.required().custom(objectId),
    userRoleId: Joi.required().custom(objectId),
  }),
};

const addCustomerSubscription = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
};

const getCustomerSubscription = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
};

const deleteCustomerSubscription = {
  params: Joi.object().keys({
    customerId: Joi.required().custom(objectId),
    customerSubscriptionId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerUser,
  deleteCustomerUser,
  addCustomerSubscription,
  getCustomerSubscription,
  deleteCustomerSubscription,
};
