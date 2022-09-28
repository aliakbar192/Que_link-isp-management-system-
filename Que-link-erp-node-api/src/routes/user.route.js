const express = require("express");
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");

const router = express.Router();

router
	.route("/")
	.post(validate(userValidation.createUser), userController.createUser)
	.get(validate(userValidation.getUsers), userController.getUsers);

router
	.route("/:userId")
	.get(validate(userValidation.getUser), userController.getUser)
	.put(validate(userValidation.updateUser), userController.updateUser)
	.delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
