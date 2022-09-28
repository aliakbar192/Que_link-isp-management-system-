const Joi = require("joi");
const { objectId, password, userName } = require("./custom.validation");

const createBilling = {
  body: Joi.object().keys({
    dealerId: Joi.string().required().custom(objectId),
    userId: Joi.string().required().custom(objectId),
    franchiseId: Joi.string().required().custom(objectId),
    amount: Joi.number().required(),
  }),
};

const getBillings = {
  query: Joi.object().keys({
    filter: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBilling = {
  params: Joi.object().keys({
    billingId: Joi.string().custom(objectId),
  }),
};
// const getBillingByDealer = {
//   params: Joi.object().keys({
//     dealerId: Joi.string().custom(objectId),
//     billingId: Joi.string().custom(objectId),
//   }),
// };

const updateBilling = {
  params: Joi.object().keys({
    billingId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      dealerId: Joi.string().required().custom(objectId),
      userId: Joi.string().required().custom(objectId),
      franchiseId: Joi.string().required().custom(objectId),
      amount: Joi.number().required(),
    })
    .min(1),
};

const deleteBiling = {
  params: Joi.object().keys({
    billingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBilling,
  getBilling,
  // getBillingByDealer,
  getBillings,
  updateBilling,
  deleteBiling,
};
