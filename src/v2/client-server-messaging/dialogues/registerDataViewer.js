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
    handler: ({
      clientId,
      webSocket,
      clientGroups: { dataViewers },
      connections,
    }) => {
      console.log("Server: registering dataViewer");
      console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
      console.log(`New dataViewer: ${clientId}`);
      dataViewers.addClient(clientId, webSocket, "available");
    },
  },
];

export default registerDataViewerMessages;
