const BaseResponse = require("./baseResponse");
const { BUSINESS_CODE } = require("./businessCode");

class ResponseUtils {
  static success(data) {
    return new BaseResponse(
      BUSINESS_CODE.SUCCESS.code,
      BUSINESS_CODE.SUCCESS.message,
      data
    );
  }

  static error(code, message = "") {
    if (typeof code === "object" && code) {
      return new BaseResponse(code.code, message || code.message, null);
    }
    return new BaseResponse(
      code,
      message || BUSINESS_CODE.SYSTEM_ERROR.message,
      null
    );
  }
}

module.exports = ResponseUtils;
