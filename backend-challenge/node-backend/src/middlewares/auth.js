const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const VALID_API_KEY = config.apiKey;

function apiKeyMiddleware(req, res, next) {
  const apiKey = req.header("api_key");

  if (!apiKey) {
    return next(new ApiError(401, "UNAUTHORIZED", "Missing API key"));
  }

  if (apiKey !== VALID_API_KEY) {
    return next(new ApiError(403, "FORBIDDEN", "Invalid API key"));
  }

  next();
}

module.exports = apiKeyMiddleware;
