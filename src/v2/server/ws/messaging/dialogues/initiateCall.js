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
        console.log("Receiver is available");
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
        // clientGroups.broadcastReceivers(transmitters);
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
    handler: ({ clientId, connections, payload }) => {
      const receiver = connections.getOtherPartysSocket(clientId);
      receiver.send(JSON.stringify({ type: "fromTransmitter", payload }));
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
    handler: ({ clientId, connections, payload }) => {
      const transmitter = connections.getOtherPartysSocket(clientId);
      transmitter.send(JSON.stringify({ type: "fromReceiver", payload }));
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
    handler: ({ clientId, connections, clientGroups: { receivers } }) => {
      const parties = connections.terminate(clientId);
      const receiver = receivers.getWebSocket(parties.receiverID);
      receiver.send(JSON.stringify({ type: "terminated" }));
      // clientGroups.broadcastReceivers(transmitters);
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
      // clientGroups.broadcastReceivers(transmitters);
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
