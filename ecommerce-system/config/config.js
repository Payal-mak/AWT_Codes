require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  PRODUCTS_FILE: process.env.PRODUCTS_FILE,
  USERS_FILE: process.env.USERS_FILE,
  ORDERS_FILE: process.env.ORDERS_FILE,
  CARTS_FILE: process.env.CARTS_FILE,
  CORS_ORIGINS: process.env.CORS_ORIGINS
};