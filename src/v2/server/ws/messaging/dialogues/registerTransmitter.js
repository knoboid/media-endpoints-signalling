const registerTransmitterMessages = [
  {
    server: true,
    clientType: "transmitter",
    zeroMessage: true,
    handler: (options) => {
      const { clientId, webSocket, clientGroups } = options;
      console.log(`New transmitter: ${clientId}`);
      const transmitters = clientGroups.transmitters;
      transmitters.addClient(clientId, webSocket, "available");
    },
  },
];

export default registerTransmitterMessages;
