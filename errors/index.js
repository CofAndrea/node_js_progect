const CustomAPIError = require('./custom-Api');
const UnauthenticatedError = require('./not-Authenticated');
const NotFoundError = require('./not-Found');
const BadRequestError = require('./bad-Request');
const UnauthorizedError = require('./not-Authorized');
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};
