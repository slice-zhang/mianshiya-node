class BaseResponse {
  constructor(code, message, data) {
    this.message = message;
    this.code = code;
    this.data = data;
  }
}

module.exports = BaseResponse;
