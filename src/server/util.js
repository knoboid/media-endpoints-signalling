require("dotenv").config();
const env = process.env;

function getEnv(envVar) {
  return env[envVar];
}

exports.getEnv = getEnv;
