function wsReciever({ type, payload, clientId, users }) {
  let caller;
  const callers = users.getCallers();
  const connections = users.getConnections();
  switch (type) {
    case "fromReciever":
      console.log("Handling fromReciever");
      caller = connections.getOtherPartysSocket(clientId);
      caller.send(JSON.stringify({ type, payload }));
      break;

    case "terminated":
      console.log("Handling terminated");
      if (connections.isConnected(clientId)) {
        const parties = connections.terminate(clientId);
        caller = callers.getClient(parties.callerID);
        caller.send(JSON.stringify({ type: "terminated" }));
        users.broadcastRecievers(callers);
      }
      break;

    default:
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsReciever;
