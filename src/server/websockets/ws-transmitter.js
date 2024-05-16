function wsTransmitter({
  type,
  payload,
  clientId,
  userGroups: clientGroups,
  pendingConnections,
}) {
  let receiver;
  const transmitters = clientGroups.getTransmitters();
  const receivers = clientGroups.getReceivers();
  const connections = clientGroups.getConnections();
  const client = transmitters.getClient(clientId);

  switch (type) {
    case "getReceivers":
      client.send(
        JSON.stringify({
          type: "updateReceivers",
          payload: { receivers: receivers.getList() },
        })
      );
      break;
    case "initiateCall":
      /* first contact from a transmitter wishing to make a call */
      const { receiverID, uuid } = payload;
      const pendingConnection = pendingConnections.get(uuid);
      console.log("pendingConnection");
      console.log(pendingConnection);
      console.log("receiverID");
      console.log(receiverID);
      console.log(
        `Preparing to initiate call  between ${clientId} and ${receiverID}`
      );
      if (connections.attempt(clientId, receiverID)) {
        console.log("Receiver is available");
        client.send(
          JSON.stringify({
            type: "initiateCallSuccess",
            payload: { receiverID },
          })
        );
        const receiver = receivers.getClient(receiverID);
        receiver.send(
          JSON.stringify({
            type: "newConnectionRequest",
            payload: { transmitterID: clientId },
          })
        );
        clientGroups.broadcastReceivers(transmitters);
      } else {
        console.log("Receiver is NOT available");
        client.send(
          JSON.stringify({
            type: "initiateCallFailure",
            payload: { receiverID },
          })
        );
      }
      break;

    case "fromTransmitter":
      console.log("Handling fromTransmitter");
      receiver = connections.getOtherPartysSocket(clientId);
      receiver.send(JSON.stringify({ type, payload }));
      break;

    case "terminated":
      console.log("Handling terminated");
      const parties = connections.terminate(clientId);
      receiver = receivers.getClient(parties.receiverID);
      receiver.send(JSON.stringify({ type: "terminated" }));
      clientGroups.broadcastReceivers(transmitters);
      break;

    default:
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsTransmitter;
