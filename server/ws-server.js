const ws = require("ws");
const Clients = require("./clients");
let clientCounter = 0;

const callers = new Clients();
const responders = new Clients();

const wsServer = new ws.Server({ noServer: true });

function broadcastRespondersUpdate(respondersList) {
  callers.getClients().forEach((client) => {
    client.send(
      JSON.stringify({
        type: "updateResponders",
        payload: { responders: respondersList },
      })
    );
  });
}

wsServer.on("connection", (client, req) => {
  const initialRequest = req;
  const clientId = clientCounter;
  let messageCounter = 0;
  let clientType;

  client.send(clientId);

  client.on("message", (message) => {
    // console.log(`Got message  '${messageCounter}' for client '${clientId}'`);
    const object = JSON.parse(message.toString());
    switch (messageCounter) {
      case 0:
        const { id } = object;
        clientType = object.clientType;
        if (isNaN(id)) throw new TypeError("Expected a number");
        if (id !== clientId)
          throw new Error(`Expect id of ${clientId}, instead got ${id}`);
        if (clientType === "caller") {
          console.log(`Registering caller ${clientId}`);
          callers.addCLient(clientId, client, "available");
        } else if (clientType === "responder") {
          console.log(`Registering responder ${clientId}`);
          responders.addCLient(clientId, client, "available");
          broadcastRespondersUpdate(responders.getList());
        }
        break;

      default:
        const { type, payload } = object;
        console.log(type);
        switch (type) {
          case "info":
            client.send(
              JSON.stringify({ type, payload: { client, initialRequest } })
            );
            break;
          case "getResponders":
            client.send(
              JSON.stringify({
                type: "updateResponders",
                payload: { responders: responders.getList() },
              })
            );

            break;

          default:
            break;
        }
        break;
    }
    messageCounter++;
  });

  client.on("close", () => {
    console.log(`Closing connection to ${clientType} with id: ${clientId}`);
    if (clientType === "caller") {
      callers.remove(clientId);
    } else if (clientType === "responder") {
      responders.remove(clientId);
    }
  });

  clientCounter++;
});

exports.wsServer = wsServer;
