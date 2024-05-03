function wsUser({ client, type, payload, clientId, redeemCodes }) {
  switch (type) {
    case "registerTransmitter":
      console.log("registerTransmitter");
      const code = redeemCodes.generate(clientId, "registerTransmitter");
      console.log(code);
      client.send(JSON.stringify({ type: "acceptTransmitter", payload: code }));
      break;

    default:
      console.log(`ws user - unhandled type: ${type}`);
      console.log("payload");
      console.log(payload);
      break;
  }
}

module.exports = wsUser;
