const registerRecieverMessages = [
  {
    server: true,
    clientType: "reciever",
    zeroMessage: true,
    handler: (options) => {
      const { clientId, webSocket, clientGroups } = options;
      console.log(`New reciever: ${clientId}`);
      const receivers = clientGroups.receivers;
      receivers.addClient(clientId, webSocket, "available");
      webSocket.send(JSON.stringify({ type: "recieverRegistered" }));
    },
  },
];

export default registerRecieverMessages;
