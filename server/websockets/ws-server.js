const ws = require("ws");
const Clients = require("../switchboard/clients");
const Connections = require("../switchboard/connections");
const wsAdmin = require("./ws-admin");
const wsResponder = require("./ws-responder");
const wsCaller = require("./ws-caller");
const Users = require("../users/users");

let clientCounter = 0;

const callers = new Clients();
const responders = new Clients();
const connections = new Connections(callers, responders);

const users = new Users(connections, callers, responders);

const clientTypes = {};

const wsServer = new ws.Server({ noServer: true });

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
        clientTypes[clientId] = clientType;
        if (clientType === "caller") {
          console.log(`Registering caller ${clientId}`);
          callers.addClient(clientId, client, "available");
        } else if (clientType === "responder") {
          console.log(`Registering responder ${clientId}`);
          responders.addClient(clientId, client, "available");
          users.broadcastResponders(callers);
        } else if (clientType === "admin") {
          console.log("got admin");
          client.send(
            JSON.stringify({
              type: "password",
            })
          );
        }
        break;

      default:
        const { type, payload } = object;
        console.log(`### type: ${clientType}`);
        switch (clientType) {
          case "admin":
            wsAdmin({ client, type, payload });
            break;
          case "responder":
            console.log("responder case");
            console.log(type);
            wsResponder({ type, payload, clientId, users });
            break;
          case "caller":
            wsCaller({ type, payload, clientId, users });
            break;
          default:
            console.log(`UNHANDLE Client Type: ${clientType}`);
            break;
        }
        break;
    }
    messageCounter++;
  });

  client.on("close", () => {
    console.log(`Closing connection to ${clientType} with id: ${clientId}`);
    const parties = connections.terminateIfBusy(clientId);

    if (clientType === "caller") {
      if (parties) {
        const responder = responders.getClient(parties.responderID);
        responder.send(JSON.stringify({ type: "terminated" }));
      }
      callers.remove(clientId);
    } else if (clientType === "responder") {
      if (parties) {
        const caller = callers.getClient(parties.callerID);
        caller.send(JSON.stringify({ type: "terminated" }));
      }
      responders.remove(clientId);
    }
    users.broadcastResponders(callers);
  });

  clientCounter++;
});

exports.wsServer = wsServer;
