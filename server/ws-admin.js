const getEnv = require("./util").getEnv;

let authenticated = false;

function wsAdmin({ client, type, payload }) {
  switch (type) {
    case "secret":
      console.log("got secret");
      console.log(payload);
      console.log(getEnv("WS_ADMIN_SECRET"));
      authenticated = payload === getEnv("WS_ADMIN_SECRET");
      break;

    case "authenticated":
      client.send(JSON.stringify({ type, payload: authenticated }));
      break;

    default:
      console.log(`ws admin - unhandled type: ${type}`);

      break;
  }
}

module.exports = wsAdmin;
