const { httpStatus, message } = require("../utils/constant");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const objectUtil = require("../utils/objectUtil");

const ApiResponse = require("../utils/ApiResponse");
const { networkServerService } = require("../services");
const {
  customerService,
  userService,
  userRoleService,
  packageService,
  customerSubscriptionService,
  mikrotikService,
  billingService,
} = require("../services");
const { updateBilling } = require("./billing.controller");
const { getBillingById } = require("../services/billing.services");

const createCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.json(
    new ApiResponse(httpStatus.CREATED, message.SUCCESS, { customer: customer })
  );
});

const getCustomers = catchAsync(async (req, res) => {
  const filter = objectUtil.pick(req.query, ["filter"]);
  const options = objectUtil.pick(req.query, ["sortBy", "limit", "page"]);
  const customers = await customerService.queryCustomers(filter, options);
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, { customers: customers })
  );
});

const getCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, { customer: customer })
  );
});

const updateCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.updateCustomerById(
    req.params.customerId,
    req.body
  );
  res.json(
    new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, {
      customer: customer,
    })
  );
});

const deleteCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.deleteCustomerById(
    req.params.customerId
  );
  res.json(
    new ApiResponse(httpStatus.ACCEPTED, message.SUCCESS, {
      customer: customer,
    })
  );
});

const addCustomerUser = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userService.gatUserByUsernameOrEmail(req.body.userName);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const userRole = await userRoleService.createUserRole({
    userId: user.id,
    roleId: customer.id,
    role: "customer",
  });
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      customer: customer,
      user: user,
      userRole: userRole,
    })
  );
});

const getCustomerUsers = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const users = await userRoleService.getUserByRole(customer.id, "customer");
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      customer: customer,
      users: users,
    })
  );
});

const deleteCustomerUser = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user = await userRoleService.deleteUserRoleById(req.params.userRoleId);
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      customer: customer,
      user: user,
    })
  );
});

const addCustomerSubscription = catchAsync(async (req, res) => {
  let pkg_price = "";
  let billingId;
  let dealer_Id;
  let franchise_Id;
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const package = await packageService.getPackageById(customer.packageId);
  if (!package) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const user_role = await userRoleService.getUserRole(req.user.dataValues.id);
  const userrole = JSON.parse(JSON.stringify(user_role));

  if (userrole[0].role == "dealer") {
    dealer_Id = userrole[0].roleId;
    const data = await billingService.queryBillings();
    if (data) {
      data.forEach((item) => {
        if (item.dealerId == dealer_Id) {
          balance = item.amount;
          billingId = item.id;
          franchise_Id = item.franchiseId;
          console.log("amount is", balance);
          console.log("billingid is", billingId);
          console.log("daler id", dealer_Id);
          console.log("fre id", franchise_Id);
        }
      });
    }
    const pkg_amount = JSON.parse(JSON.stringify(package));
    pkg_price = pkg_amount.charges;
    console.log(pkg_price);
    if (balance >= pkg_price) {
      const dealerBilling = await getBillingById(billingId);

      Object.assign(dealerBilling, { amount: balance - pkg_amount.charges });
      await dealerBilling.save();
      const networkServer =
        await networkServerService.getNetworkServerByCustomerId(customer.id);
      if (!networkServer) {
        throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
      }
      const nasClient = {
        name: customer.userName,
        password: customer.secret,
        profile: package.profileName,
      };
      const nasServer = {
        id: networkServer.id,
        ip: networkServer.ipAddress,
        name: networkServer.userName,
        password: networkServer.password,
      };

      let pppoeUser = await mikrotikService.addMikrotikApiUser(
        nasServer,
        nasClient
      );
      const customerSubscription =
        await customerSubscriptionService.createCustomerSubscription({
          packageId: package.id,
          customerId: customer.id,
        });

      res.json(
        new ApiResponse(httpStatus.OK, message.SUCCESS, {
          customer: customer,
          package: package,
          customerSubscription: customerSubscription,
          status: pppoeUser,
        })
      );
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, message.INSUFFICIENT_BALANCE);
    }
  } else {
    const networkServer =
      await networkServerService.getNetworkServerByCustomerId(customer.id);
    if (!networkServer) {
      throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
    }
    const nasClient = {
      name: customer.userName,
      password: customer.secret,
      profile: package.profileName,
    };
    const nasServer = {
      id: networkServer.id,
      ip: networkServer.ipAddress,
      name: networkServer.userName,
      password: networkServer.password,
    };
    let pppoeUser = await mikrotikService.addMikrotikApiUser(
      nasServer,
      nasClient
    );
    const customerSubscription =
      await customerSubscriptionService.createCustomerSubscription({
        packageId: package.id,
        customerId: customer.id,
      });
    res.json(
      new ApiResponse(httpStatus.OK, message.SUCCESS, {
        customer: customer,
        package: package,
        customerSubscription: customerSubscription,
        status: pppoeUser,
      })
    );
  }
});

const getCustomerSubscriptions = catchAsync(async (req, res) => {
  console.log(req.user);
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const customerSubscription =
    await customerSubscriptionService.getCustomerSubscriptionsByCustomerId(
      customer.id
    );
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      customer: customer,
      customerSubscription: customerSubscription,
    })
  );
});

const deleteCustomerSubscription = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const networkServer = await networkServerService.getNetworkServerByCustomerId(
    customer.id
  );
  if (!networkServer) {
    throw new ApiError(httpStatus.NOT_FOUND, message.NOT_FOUND);
  }
  const nasClient = { name: customer.userName };
  const nasServer = {
    id: networkServer.id,
    ip: networkServer.ipAddress,
    name: networkServer.userName,
    password: networkServer.password,
  };
  let pppoeUser = await mikrotikService.removeMikrotikApiUser(
    nasServer,
    nasClient
  );
  const customerSubscription =
    await customerSubscriptionService.deleteCustomerSubscriptionsById(
      req.params.customerSubscriptionId
    );
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      customer: customer,
      customerSubscription: customerSubscription,
      status: pppoeUser,
    })
  );
});

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerUser,
  getCustomerUsers,
  deleteCustomerUser,
  addCustomerSubscription,
  getCustomerSubscriptions,
  deleteCustomerSubscription,
};
