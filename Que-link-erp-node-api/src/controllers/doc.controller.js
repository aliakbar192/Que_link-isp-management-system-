const catchAsync = require("../utils/catchAsync");
const { httpStatus, message } = require("../utils/constant");
const ApiResponse = require("../utils/ApiResponse");

const documentation = catchAsync(async (req, res) => {
  res.json(
    new ApiResponse(httpStatus.OK, message.SUCCESS, {
      message: "Not supported yet",
    })
  );
});

module.exports = {
  documentation,
};
