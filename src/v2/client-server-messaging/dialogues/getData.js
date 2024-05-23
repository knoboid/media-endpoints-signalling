const getDataMessages = [
  {
    server: true,
    clientType: "dataViewer",
    type: "getData",
    handler: ({ clientModel, webSocket }) => {
      webSocket.send(
        JSON.stringify({
          type: "endpointData",
          payload: clientModel.connections.getData(),
        })
      );
    },
  },
  {
    server: false,
    clientType: "dataViewer",
    type: "endpointData",
    handler: ({ dispatch, payload }) => {
      dispatch("endpointData", { payload });
    },
  },
];

export default getDataMessages;
