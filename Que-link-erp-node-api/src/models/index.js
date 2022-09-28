const { sequelize, Sequelize } = require("../config/database");

const database = { sequelize, Sequelize };

// Models

const User = require("./user.model")(sequelize, Sequelize);
const UserRole = require("./userRole.model")(sequelize, Sequelize);
const Token = require("./token.model")(sequelize, Sequelize);
const Tenant = require("./tenant.model")(sequelize, Sequelize);
const NetworkServer = require("./networkServer.model")(sequelize, Sequelize);
const Package = require("./package.model")(sequelize, Sequelize);
const Franchise = require("./frunchise.model")(sequelize, Sequelize);
const Dealer = require("./dealer.model")(sequelize, Sequelize);
const Customer = require("./customer.model")(sequelize, Sequelize);
const CustomerSubscription = require("./customerSubscription.model")(
  sequelize,
  Sequelize
);
const Billing = require("./billing.model")(sequelize, Sequelize);

// Association

User.hasMany(Token, { foreignKey: "userId" });
Token.belongsTo(User);
User.hasMany(UserRole, { foreignKey: "userId" });
UserRole.belongsTo(User);
Tenant.hasMany(NetworkServer, { foreignKey: "tenantId" });
NetworkServer.belongsTo(Tenant);
Tenant.hasMany(Package, { foreignKey: "tenantId" });
Package.belongsTo(Tenant);
Tenant.hasMany(Franchise, { foreignKey: "tenantId" });
Franchise.belongsTo(Tenant);
// NetworkServer.belongsTo(Franchise, {foreignKey: 'networkServerId'});
Franchise.hasMany(Dealer, { foreignKey: "franchiseId" });
Dealer.belongsTo(Franchise);
Dealer.hasMany(Customer, { foreignKey: "dealerId" });
Customer.belongsTo(Dealer);
Customer.hasMany(CustomerSubscription, { foreignKey: "customerId" });
CustomerSubscription.belongsTo(Customer);
Package.hasMany(CustomerSubscription, { foreignKey: "packageId" });
CustomerSubscription.belongsTo(Package);
Billing.belongsTo(Dealer);
Dealer.hasMany(Billing, { foreignKey: "franchiseId" });
Billing.belongsTo(User);
User.hasMany(Billing, { foreignKey: "userId" });
const models = {
  User,
  UserRole,
  Token,
  Tenant,
  NetworkServer,
  Package,
  Franchise,
  Dealer,
  Customer,
  CustomerSubscription,
  Billing,
};

module.exports = { ...database, ...models };
