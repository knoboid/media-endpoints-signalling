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
    handler: ({ clientId, webSocket, clientModel }) => {
      console.log(`New receiver: ${clientId}`);
      clientModel.createReceiver(clientId, webSocket);
      webSocket.send(JSON.stringify({ type: "receiverRegistered" }));
      clientModel.broadcastToClientGroup(
        "dataViewer",
        "endpointData",
        clientModel.connections.getData()
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
    handler: ({ clientModel, clientId }) => {
      clientModel.deleteClient(clientId);
    },
  },
];

export default registerReceiverMessages;
