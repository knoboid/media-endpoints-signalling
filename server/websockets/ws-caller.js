function wsCaller({ type, payload, clientId, users }) {
  let reciever;
  const callers = users.getCallers();
  const recievers = users.getRecievers();
  const connections = users.getConnections();
  const client = callers.getClient(clientId);

  switch (type) {
    case "getRecievers":
      client.send(
        JSON.stringify({
          type: "updateRecievers",
          payload: { recievers: recievers.getList() },
        })
      );
      break;
    case "initiateCall":
      /* first contact from a caller wishing to make a call */
      const { recieverID } = payload;
      console.log(
        `Preparing to initiate call  between ${clientId} and ${recieverID}`
      );
      if (connections.attempt(clientId, recieverID)) {
        console.log("Reciever is available");
        client.send(
          JSON.stringify({
            type: "initiateCallSuccess",
            payload: { recieverID },
          })
        );
        const reciever = recievers.getClient(recieverID);
        reciever.send(
          JSON.stringify({
            type: "initiateResponse",
            payload: { callerID: clientId },
          })
        );
        users.broadcastRecievers(callers);
      } else {
        console.log("Reciever is NOT available");
        client.send(
          JSON.stringify({
            type: "initiateCallFailure",
            payload: { recieverID },
          })
        );
      }
      break;

    case "fromCaller":
      console.log("Handling fromCaller");
      reciever = connections.getOtherPartysSocket(clientId);
      reciever.send(JSON.stringify({ type, payload }));
      break;

    case "terminated":
      console.log("Handling terminated");
      const parties = connections.terminate(clientId);
      reciever = recievers.getClient(parties.recieverID);
      reciever.send(JSON.stringify({ type: "terminated" }));
      users.broadcastRecievers(callers);
      break;

    default:
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsCaller;
