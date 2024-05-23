const initiateCallMessages = [
  {
    server: true,
    clientType: "transmitter",
    type: "initiateCall",
    handler: ({ payload, clientId, webSocket, clientModel }) => {
      const receiverID = Number(payload.receiverID); // Fragile
      if (isNaN(receiverID) || isNaN(clientId)) return;
      if (clientModel.connections.attempt(clientId, receiverID).result) {
        console.log("Receiver is available");
        webSocket.send(
          JSON.stringify({
            type: "initiateCallSuccess",
            payload: { receiverID },
          })
        );
        const receiverSocket = clientModel.getClient(receiverID).getWebSocket();
        receiverSocket.send(
          JSON.stringify({
            type: "newConnectionRequest",
            payload: { transmitterID: clientId },
          })
        );
        clientModel.broadcastToClientGroup(
          "dataViewer",
          "endpointData",
          clientModel.connections.getData()
        );
      } else {
        console.log("Receiver is NOT available");
        webSocket.send(
          JSON.stringify({
            type: "initiateCallFailure",
            payload: { receiverID },
          })
        );
      }
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "initiateCallSuccess",
    handler: ({ dispatch, payload }) => {
      const receiverID = payload.receiverID;
      dispatch("initiateCallSuccess", { receiverID });
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "initiateCallFailure",
    handler: ({ dispatch }) => {
      dispatch("initiateCallFailure", { receiverID });
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "newConnectionRequest",
    handler: ({ dispatch, payload }) => {
      dispatch("newConnectionRequest", payload);
    },
  },
  {
    server: true,
    clientType: "transmitter",
    type: "fromTransmitter",
    handler: ({ clientId, clientModel, payload }) => {
      const client = clientModel.getClient(clientId);
      const receiverSocket = clientModel
        .getClient(client.otherParty)
        .getWebSocket();
      receiverSocket.send(JSON.stringify({ type: "fromTransmitter", payload }));
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "fromTransmitter",
    handler: ({ dispatch, payload }) => {
      dispatch("fromTransmitter", payload);
    },
  },
  {
    server: true,
    clientType: "receiver",
    type: "fromReceiver",
    handler: ({ clientId, clientModel, payload }) => {
      const client = clientModel.getClient(clientId);
      const transmitterSocket = clientModel
        .getClient(client.otherParty)
        .getWebSocket();
      transmitterSocket.send(JSON.stringify({ type: "fromReceiver", payload }));
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "fromReceiver",
    handler: ({ dispatch, payload }) => {
      dispatch("fromReceiver", payload);
    },
  },
  {
    server: true,
    clientType: "transmitter",
    type: "terminated",
    handler: ({ clientId, clientModel }) => {
      const client = clientModel.getClient(clientId);
      const receiverSocket = clientModel
        .getClient(client.otherParty)
        .getWebSocket();
      clientModel.connections.disconnectTransmitter(clientId);
      receiverSocket.send(JSON.stringify({ type: "terminated" }));
      clientModel.broadcastToClientGroup(
        "dataViewer",
        "endpointData",
        clientModel.connections.getData()
      );
    },
  },
  {
    server: true,
    clientType: "receiver",
    type: "terminated",
    handler: ({ clientId, clientModel }) => {
      const client = clientModel.getClient(clientId);
      const transmitterSocket = clientModel
        .getClient(client.otherParty)
        .getWebSocket();
      clientModel.connections.disconnectReceiver(clientId);
      transmitterSocket.send(JSON.stringify({ type: "terminated" }));
      clientModel.broadcastToClientGroup(
        "dataViewer",
        "endpointData",
        clientModel.connections.getData()
      );
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "terminated",
    handler: ({ dispatch }) => {
      dispatch("terminated");
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "terminated",
    handler: ({ dispatch }) => {
      dispatch("terminated");
    },
  },
];

export default initiateCallMessages;
