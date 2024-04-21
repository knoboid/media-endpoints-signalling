const fs = require("fs");
require("dotenv").config();

const env = process.env;

const privateKey = fs.readFileSync(env.SERVER_KEY, "utf8");

const certificate = fs.readFileSync(env.SERVER_CERT, "utf8");

exports.credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: env.PASSPHRASE,
};
