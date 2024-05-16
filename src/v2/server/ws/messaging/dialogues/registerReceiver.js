const registerReceiverMessages = [
  {
    server: false,
    clientType: "receiver",
    zeroMessage: true,
    handler: ({ type, payload, data, webSocket, clientType }) => {
      console.assert(type === "clientId");
      const id = payload.clientId;
      if (isNaN(id)) throw new TypeError("Expected a number");
      data.id = id;
      webSocket.send(JSON.stringify({ id, clientType }));
    },
  },
  {
    server: true,
    clientType: "receiver",
    zeroMessage: true,
    handler: (options) => {
      const { clientId, webSocket, clientGroups } = options;
      console.log(`New receiver: ${clientId}`);
      const receivers = clientGroups.receivers;
      receivers.addClient(clientId, webSocket, "available");
      webSocket.send(JSON.stringify({ type: "receiverRegistered" }));
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "receiverRegistered",
    handler: ({ dispatch, data }) => {
      dispatch("receiverRegistered", data.id);
    },
  },
];

export default registerReceiverMessages;
