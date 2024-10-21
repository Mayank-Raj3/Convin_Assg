const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  SALT: process.env.SALT,
};
