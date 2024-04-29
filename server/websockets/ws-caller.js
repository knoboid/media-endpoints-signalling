function wsCaller({
  client,
  type,
  payload,
  connections,
  clientId,
  broadcastResponders,
  responders,
}) {
  let responder;
  switch (type) {
    case "info":
      client.send(
        JSON.stringify({ type, payload: { client, initialRequest } })
      );
      break;
    case "getResponders":
      client.send(
        JSON.stringify({
          type: "updateResponders",
          payload: { responders: responders.getList() },
        })
      );
      break;
    case "initiateCall":
      /* first contact from a caller wishing to make a call */
      const { responderID } = payload;
      console.log(
        `Preparing to initiate call  between ${clientId} and ${responderID}`
      );
      if (connections.attempt(clientId, responderID)) {
        console.log("Responder is available");
        client.send(
          JSON.stringify({
            type: "initiateCallSuccess",
            payload: { responderID },
          })
        );
        const responder = responders.getClient(responderID);
        responder.send(
          JSON.stringify({
            type: "initiateResponse",
            payload: { callerID: clientId },
          })
        );
        broadcastResponders();
      } else {
        console.log("Responder is NOT available");
        client.send(
          JSON.stringify({
            type: "initiateCallFailure",
            payload: { responderID },
          })
        );
      }
      break;

    case "fromCaller":
      console.log("Handling fromCaller");
      responder = connections.getOtherPartysSocket(clientId);
      responder.send(JSON.stringify({ type, payload }));
      break;

    case "terminated":
      console.log("Handling terminated");
      const parties = connections.terminate(clientId);
      // if (clientType === "caller") {
      responder = responders.getClient(parties.responderID);
      responder.send(JSON.stringify({ type: "terminated" }));
      // } else if (clientType === "responder") {
      //   const caller = callers.getClient(parties.callerID);
      //   caller.send(JSON.stringify({ type: "terminated" }));
      // }
      broadcastResponders();
      break;

    default:
      console.log("In caller");
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsCaller;
