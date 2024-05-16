const registerTransmitterMessages = [
  {
    server: false,
    clientType: "transmitter",
    zeroMessage: true,
    handler: ({ type, payload, self, clientType }) => {
      console.assert(type === "clientId");
      const id = payload.clientId;
      if (isNaN(id)) throw new TypeError("Expect a number");
      console.log(`Setting id to ${id}`);
      self.id = id;
      // self.socket.send(JSON.stringify({ id, clientType, code }));
      self.socket.send(JSON.stringify({ id, clientType }));
      self.dispatch("onGotTransmitterID", id);
    },
  },
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
