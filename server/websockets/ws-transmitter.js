function wsTransmitter({ type, payload, clientId, users }) {
  let reciever;
  const transmitters = users.getTransmitters();
  const recievers = users.getRecievers();
  const connections = users.getConnections();
  const client = transmitters.getClient(clientId);

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
      /* first contact from a transmitter wishing to make a call */
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
            payload: { transmitterID: clientId },
          })
        );
        users.broadcastRecievers(transmitters);
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

    case "fromTransmitter":
      console.log("Handling fromTransmitter");
      reciever = connections.getOtherPartysSocket(clientId);
      reciever.send(JSON.stringify({ type, payload }));
      break;

    case "terminated":
      console.log("Handling terminated");
      const parties = connections.terminate(clientId);
      reciever = recievers.getClient(parties.recieverID);
      reciever.send(JSON.stringify({ type: "terminated" }));
      users.broadcastRecievers(transmitters);
      break;

    default:
      console.log(`UNHANDLED WS TYPE ${type}`);
      break;
  }
}

module.exports = wsTransmitter;
