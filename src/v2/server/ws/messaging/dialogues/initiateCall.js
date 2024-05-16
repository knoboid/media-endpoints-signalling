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
      const { receiverID } = payload;
      const { receivers } = clientGroups;
      if (isNaN(receiverID) || isNaN(clientId)) return;
      console.log("initiateCallMessages");
      if (connections.attempt(clientId, receiverID)) {
        console.log("Reciever is available");
        webSocket.send(
          JSON.stringify({
            type: "initiateCallSuccess",
            payload: { receiverID },
          })
        );
        const receiver = receivers.getWebSocket(receiverID);
        receiver.send(
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
    handler: ({ self, payload }) => {
      const receiverID = payload.receiverID;
      self.dispatch("initiateCallSuccess", { receiverID });
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "initiateCallFailure",
    handler: ({ self }) => {
      self.dispatch("initiateCallFailure", { receiverID });
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "newConnectionRequest",
    handler: ({ self, payload }) => {
      self.dispatch("newConnectionRequest", payload);
    },
  },
  {
    server: true,
    clientType: "transmitter",
    type: "fromTransmitter",
    handler: ({ clientId, connections, payload }) => {
      const receiver = connections.getOtherPartysSocket(clientId);
      receiver.send(JSON.stringify({ type: "fromTransmitter", payload }));
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "fromTransmitter",
    handler: ({ self, payload }) => {
      self.dispatch("fromTransmitter", payload);
    },
  },
  {
    server: true,
    clientType: "receiver",
    type: "fromReciever",
    handler: ({ clientId, connections, payload }) => {
      const transmitter = connections.getOtherPartysSocket(clientId);
      transmitter.send(JSON.stringify({ type: "fromReciever", payload }));
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "fromReciever",
    handler: ({ self, payload }) => {
      self.dispatch("fromReciever", payload);
    },
  },
  {
    server: true,
    clientType: "transmitter",
    type: "terminated",
    handler: ({ clientId, connections, clientGroups: { receivers } }) => {
      const parties = connections.terminate(clientId);
      const receiver = receivers.getWebSocket(parties.receiverID);
      receiver.send(JSON.stringify({ type: "terminated" }));
      // clientGroups.broadcastRecievers(transmitters);
    },
  },
  {
    server: true,
    clientType: "receiver",
    type: "terminated",
    handler: ({ clientId, connections, clientGroups: { transmitters } }) => {
      const parties = connections.terminate(clientId);
      const transmitter = transmitters.getClient(parties.transmitterID);
      transmitter.send(JSON.stringify({ type: "terminated" }));
      // clientGroups.broadcastRecievers(transmitters);
    },
  },
  {
    server: false,
    clientType: "receiver",
    type: "terminated",
    handler: ({ self }) => {
      self.dispatch("terminated");
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "terminated",
    handler: ({ self }) => {
      self.dispatch("terminated");
    },
  },
];

export default initiateCallMessages;
