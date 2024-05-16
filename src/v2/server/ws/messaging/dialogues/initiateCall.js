const initiateCallMessages = [
  {
    server: true,
    clientType: "transmitter",
    type: "initiateCall",
    handler: (options) => {
      const {
        payload,
        clientId,
        clientType,
        webSocket,
        clientGroups,
        connections,
      } = options;
      const { recieverID } = payload;
      const { receivers } = clientGroups;
      if (isNaN(recieverID) || isNaN(clientId)) return;
      console.log("initiateCallMessages");
      if (connections.attempt(clientId, recieverID)) {
        console.log("Reciever is available");
        webSocket.send(
          JSON.stringify({
            type: "initiateCallSuccess",
            payload: { recieverID },
          })
        );
        const reciever = receivers.getWebSocket(recieverID);
        reciever.send(
          JSON.stringify({
            type: "newConnectionRequest",
            payload: { transmitterID: clientId },
          })
        );
        // clientGroups.broadcastRecievers(transmitters);
      } else {
        console.log("Reciever is NOT available");
        webSocket.send(
          JSON.stringify({
            type: "initiateCallFailure",
            payload: { recieverID },
          })
        );
      }
    },
  },
];

export default initiateCallMessages;
