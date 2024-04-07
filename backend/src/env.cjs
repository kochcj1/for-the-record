const SERVER_PORT = process.env.SERVER_PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "forTheRecordDB";
const GROUP_TABLE_SEPARATOR = process.env.GROUP_TABLE_SEPARATOR || ".";

module.exports = {
  SERVER_PORT,
  MONGO_URL,
  DATABASE_NAME,
  GROUP_TABLE_SEPARATOR,
};
