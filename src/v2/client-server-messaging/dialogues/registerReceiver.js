import { broadcastToClientGroup } from "../util.js";

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
      const {
        clientId,
        webSocket,
        clientGroups: { receivers, dataViewers },
        connections,
      } = options;
      console.log(`New receiver: ${clientId}`);
      receivers.addClient(clientId, webSocket, "available");
      webSocket.send(JSON.stringify({ type: "receiverRegistered" }));
      broadcastToClientGroup(
        dataViewers,
        "endpointData",
        connections.getData()
      );
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
  {
    server: true,
    clientType: "receiver",
    onClose: true,
    handler: (options) => {
      console.log("Reciver Closed");
    },
  },
];

export default registerReceiverMessages;
