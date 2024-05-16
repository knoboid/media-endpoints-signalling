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
];

export default registerRecieverMessages;
