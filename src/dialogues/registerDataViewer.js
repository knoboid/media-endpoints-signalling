const registerDataViewerMessages = [
  {
    server: false,
    clientType: "dataViewer",
    zeroMessage: true,
    handler: ({ type, payload: { clientId }, data, webSocket, clientType }) => {
      console.assert(type === "clientId");
      if (isNaN(clientId)) throw new TypeError("Expected a number");
      data.id = clientId;
      webSocket.send(JSON.stringify({ id: clientId, clientType }));
    },
  },
  {
    server: true,
    clientType: "dataViewer",
    zeroMessage: true,
    handler: ({ clientId, clientModel, webSocket }) => {
      clientModel.createDataViewer(clientId, webSocket);
    },
  },
  {
    server: true,
    clientType: "dataViewer",
    onClose: true,
    handler: ({ clientModel, clientId }) => {
      clientModel.deleteClient(clientId);
    },
  },
];

export default registerDataViewerMessages;
