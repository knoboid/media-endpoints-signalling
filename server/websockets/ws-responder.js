function wsResponder({ type, payload, clientId, users }) {
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
      if (connections.isConnected(clientId)) {
        const parties = connections.terminate(clientId);
        caller = callers.getClient(parties.callerID);
        caller.send(JSON.stringify({ type: "terminated" }));
        users.broadcastResponders(callers);
      }
      break;

    default:
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsResponder;
