const ws = require("ws");
const Clients = require("../switchboard/clients");
const Connections = require("../switchboard/connections");
const wsAdmin = require("./ws-admin");
const wsReciever = require("./ws-reciever");
const wsCaller = require("./ws-caller");
const Users = require("../users/users");

let clientCounter = 0;

const callers = new Clients();
const recievers = new Clients();
const connections = new Connections(callers, recievers);

const users = new Users(connections, callers, recievers);

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
        } else if (clientType === "reciever") {
          console.log(`Registering reciever ${clientId}`);
          recievers.addClient(clientId, client, "available");
          users.broadcastRecievers(callers);
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
          case "reciever":
            wsReciever({ type, payload, clientId, users });
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
        const reciever = recievers.getClient(parties.recieverID);
        reciever.send(JSON.stringify({ type: "terminated" }));
      }
      callers.remove(clientId);
    } else if (clientType === "reciever") {
      if (parties) {
        const caller = callers.getClient(parties.callerID);
        caller.send(JSON.stringify({ type: "terminated" }));
      }
      recievers.remove(clientId);
    }
    users.broadcastRecievers(callers);
  });

  clientCounter++;
});

exports.wsServer = wsServer;
