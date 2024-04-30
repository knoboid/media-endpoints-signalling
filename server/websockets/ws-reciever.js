function wsReciever({ type, payload, clientId, users }) {
  let transmitter;
  const transmitters = users.getTransmitters();
  const connections = users.getConnections();
  switch (type) {
    case "fromReciever":
      console.log("Handling fromReciever");
      transmitter = connections.getOtherPartysSocket(clientId);
      transmitter.send(JSON.stringify({ type, payload }));
      break;

    case "terminated":
      console.log("Handling terminated");
      if (connections.isConnected(clientId)) {
        const parties = connections.terminate(clientId);
        transmitter = transmitters.getClient(parties.transmitterID);
        transmitter.send(JSON.stringify({ type: "terminated" }));
        users.broadcastRecievers(transmitters);
      }
      break;

    default:
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsReciever;
