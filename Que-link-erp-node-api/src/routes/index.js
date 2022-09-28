const express = require("express");

const docsRoute = require("./doc.route");
const testRoute = require("./test.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const adminRoute = require("./admin.route");
const tenantRoute = require("./tenant.route");
const networkServerRoute = require("./networkServer.route");
const packageRoute = require("./package.route");
const franchiseRoute = require("./franchise.route");
const dealerRoute = require("./dealer.route");
const customerRoute = require("./customer.route");
const billingRoute = require("./billing.route");

const router = express.Router();

router.use("/documentation", docsRoute);
router.use("/test", testRoute);
router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/admin", adminRoute);
router.use("/tenant", tenantRoute);
router.use("/network-server", networkServerRoute);
router.use("/package", packageRoute);
router.use("/franchise", franchiseRoute);
router.use("/dealer", dealerRoute);
router.use("/customer", customerRoute);
router.use("/billing", billingRoute);

module.exports = router;
