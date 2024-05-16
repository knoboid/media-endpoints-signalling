const registerRecieverMessages = [
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
    zeroMessage: true,
    handler: ({ type, payload, self, clientType }) => {
      console.assert(type === "clientId");
      const id = payload.clientId;
      if (isNaN(id)) throw new TypeError("Expected a number");
      self.id = id;
      self.socket.send(JSON.stringify({ id, clientType }));
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "receiverRegistered",
    handler: ({ self, dispatch }) => {
      self.dispatch("receiverRegistered", self.id);
    },
  },
];

export default registerRecieverMessages;
