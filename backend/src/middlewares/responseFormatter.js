import { createHttpResponse } from "../contracts/httpResponse.contract.js";

export const responseFormatter = (req, res, next) => {
  res.success = (data = null, msg = "Ok", statusCode = 200) => {
    return res.status(statusCode).json(createHttpResponse(msg, statusCode, data));
  };

  res.error = (msg = "Internal Server Error", statusCode = 500, details = null) => {
    return res.status(statusCode).json(createHttpResponse(msg, statusCode, details));
  };

  next();
};