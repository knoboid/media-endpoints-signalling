function wsUser({
  client,
  type,
  payload,
  clientId,
  redeemCodes,
  users,
  pendingConnections,
}) {
  let code;
  switch (type) {
    case "requestTransmitter":
      const { requestUUID } = payload;
      console.log(requestUUID);
      code = redeemCodes.generate(clientId, "registerTransmitter");
      console.log(code);
      client.send(
        JSON.stringify({
          type: "transmitterRegistrationCode",
          payload: { code, requestUUID },
        })
      );
      break;

    case "initiateCallToUser":
      console.log("initialCallToUser", payload);
      const { tranmitterId } = payload;
      const canConnect = pendingConnections.add(
        clientId,
        tranmitterId,
        payload.userId
      );
      if (canConnect) {
        const recievingUser = users.getUser(payload.userId);
        code = redeemCodes.generate(recievingUser.clientId, "registerReciever");
        recievingUser.client.send(
          JSON.stringify({
            type: "requestReciever",
            payload: { userId: clientId, code },
          })
        );
      }
      break;

    case "recieverReady":
      console.log("recieverReady", payload);
      const { userId, recieverId } = payload;
      const transmittingUser = users.getUser(payload.userId);
      transmittingUser.client.send(
        JSON.stringify({ type: "userReady", payload: { userId, recieverId } })
      );

      break;

    default:
      console.log(`ws user - unhandled type: ${type}`);
      console.log("payload");
      console.log(payload);
      break;
  }
}

module.exports = wsUser;
