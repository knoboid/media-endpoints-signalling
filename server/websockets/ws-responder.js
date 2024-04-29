function wsResponder({
  client,
  type,
  payload,
  connections,
  clientId,
  broadcastResponders,
  callers,
}) {
  let caller;
  switch (type) {
    case "info":
      client.send(
        JSON.stringify({ type, payload: { client, initialRequest } })
      );
      break;

    case "fromResponder":
      console.log("Handling fromResponder");
      caller = connections.getOtherPartysSocket(clientId);
      caller.send(JSON.stringify({ type, payload }));
      break;

    case "terminated":
      console.log("Handling terminated");
      const parties = connections.terminate(clientId);
      caller = callers.getClient(parties.callerID);
      caller.send(JSON.stringify({ type: "terminated" }));
      broadcastResponders();
      break;

    default:
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsResponder;
