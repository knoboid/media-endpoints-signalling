const registerTransmitterMessages = [
  {
    server: false,
    clientType: "transmitter",
    zeroMessage: true,
    handler: ({ type, payload, data, webSocket, dispatch, clientType }) => {
      console.assert(type === "clientId");
      const id = payload.clientId;
      if (isNaN(id)) throw new TypeError("Expect a number");
      console.log(`Setting id to ${id}`);
      data.id = id;
      // TODO redeem codes
      webSocket.send(JSON.stringify({ id, clientType }));
      dispatch("onGotTransmitterID", id);
    },
  },
  {
    server: true,
    clientType: "transmitter",
    zeroMessage: true,
    handler: ({ clientId, webSocket, clientModel }) => {
      console.log(`New transmitter: ${clientId}`);
      clientModel.createTransmitter(clientId, webSocket);
      clientModel.broadcastToClientGroup(
        "dataViewer",
        "endpointData",
        clientModel.connections.getData()
      );
    },
  },
  {
    server: true,
    clientType: "transmitter",
    onClose: true,
    handler: ({ clientModel, clientId }) => {
      clientModel.deleteClient(clientId);
    },
  },
];

export default registerTransmitterMessages;
