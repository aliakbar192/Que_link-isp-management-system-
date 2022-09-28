const express = require("express");
const { testController } = require("../controllers");
const auth = require("../middlewares/auth");
// const { customerSubscriptionService } = require("../services");

const router = express.Router();

router.get("/agent", testController.requestInfo);
router.get("/auth", auth(), testController.connection);
router.get("/userSync", testController.syncCustomerSubscriptions);
// router.post("/abc", testController.connectionPost);
router.get("/", testController.connection);

module.exports = router;
