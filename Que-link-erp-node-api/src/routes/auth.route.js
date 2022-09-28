const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");

const router = express.Router();
router.get("/", function (req, res) {
  res.send("Not supported yet");
});

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/profile",
  validate(authValidation.profile),
  auth(),
  authController.profile
);
router.post(
  "/change-password",
  validate(authValidation.changePassword),
  auth(),
  authController.changePassword
);
router.post(
  "/login-devices",
  validate(authValidation.loginDevices),
  auth(),
  authController.loginDevices
);
router.post(
  "/refresh-access",
  validate(authValidation.refreshAccessToken),
  authController.refreshAccessToken
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

module.exports = router;
