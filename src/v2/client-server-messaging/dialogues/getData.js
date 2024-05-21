const getDataMessages = [
  {
    server: true,
    clientType: "transmitter",
    type: "getData",
    handler: ({ connections, webSocket }) => {
      webSocket.send(
        JSON.stringify({
          type: "endpointData",
          payload: connections.getData(),
        })
      );
    },
  },
  {
    server: false,
    clientType: "transmitter",
    type: "endpointData",
    handler: ({ dispatch, payload }) => {
      dispatch("endpointData", { payload });
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
