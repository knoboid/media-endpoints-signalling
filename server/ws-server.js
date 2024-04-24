const ws = require("ws");
const Clients = require("./clients");
let clientCounter = 0;

const callers = new Clients();
const responders = new Clients();

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection", (client, req) => {
  const initialRequest = req;
  const clientId = clientCounter;
  let messageCounter = 0;

  console.log(`Got connection: ${clientId}`);
  client.send(clientId);

  client.on("message", (message) => {
    console.log(`Got message  '${messageCounter}' for client '${clientId}'`);
    const object = JSON.parse(message.toString());
    switch (messageCounter) {
      case 0:
        const { id, clientType } = object;
        if (isNaN(id)) throw new TypeError("Expected a number");
        if (id !== clientId)
          throw new Error(`Expect id of ${clientId}, instead got ${id}`);
        console.log(clientType);
        if (clientType === "caller") {
          callers.addCLient(clientId, client, clientType, "available");
        } else if (clientType === "responder") {
          responders.addCLient(clientId, client, clientType, "available");
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

          default:
            break;
        }
        break;
    }
    messageCounter++;
  });

  clientCounter++;
});

exports.wsServer = wsServer;
