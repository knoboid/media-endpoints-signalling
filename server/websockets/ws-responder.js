function wsResponder({ type, payload, clientId, broadcastResponders, users }) {
  let caller;
  const callers = users.getCallers();
  const connections = users.getConnections();
  switch (type) {
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
