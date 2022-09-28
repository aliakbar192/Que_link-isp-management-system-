const { httpStatus, message } = require("../utils/constant");
const { Dealer, Tenant, Billing, User, Franchise } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const createBilling = async (billingBody) => {
  let billing = await Billing.create(billingBody);
  return billing;
};

const queryBillings = async (filter, options) => {
  const billings = await Billing.findAll({
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
      },
      {
        model: User,
      },
    ],
  });
  return billings;
};

const getBillingById = async (billingId) => {
  let billing = await Billing.findOne({
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
      },
    ],
    where: {
      id: billingId,
    },
  });
  return billing;
};

// const getBillingByDealer = async (id) => {
//   let billing = await Billing.findAll({
//     include: [
//       {
//         model: Dealer,
//         attributes: ["id", "name", "franchiseId"],
//         include: [
//           {
//             model: Franchise,
//             attributes: ["id", "name", "tenantId"],
//             include: [
//               {
//                 model: Tenant,
//                 attributes: ["id", "companyName"],
//               },
//             ],
//           },
//         ],
//         where: {
//           id: id,
//         },
//       },
//     ],
//   });
//   return billing;
// };

const getBillingByFranchiseId = async (id) => {
  let billing = await Billing.findAll({
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
  return billing;
};

const updateBillingById = async (billingId, updateBillingBody) => {
  const billing = await getBillingById(billingId);
  if (!billing) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  Object.assign(billing, updateBillingBody);
  await billing.save();
  return billing;
};

const deleteBillingById = async (billingId) => {
  const billing = await getBillingById(billingId);
  if (!billing) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }

  await billing.destroy();
  return billing;
};

module.exports = {
  createBilling,
  queryBillings,
  getBillingById,
  // getBillingByDealer,
  getBillingByFranchiseId,
  updateBillingById,
  deleteBillingById,
};
