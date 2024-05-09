const fs = require("fs");
const getEnv = require("./util").getEnv;

const privateKey = fs.readFileSync(getEnv("SERVER_KEY"), "utf8");
const certificate = fs.readFileSync(getEnv("SERVER_CERT"), "utf8");
const passphrase = getEnv("PASSPHRASE");

exports.credentials = {
  key: privateKey,
  cert: certificate,
  passphrase,
};
