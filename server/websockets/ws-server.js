const ws = require("ws");
const Clients = require("../switchboard/clients");
const Connections = require("../switchboard/connections");
const wsAdmin = require("./ws-admin");
const wsReciever = require("./ws-reciever");
const wsTransmitter = require("./ws-transmitter");
const Users = require("../users/users");

let clientCounter = 0;

const transmitters = new Clients();
const recievers = new Clients();
const connections = new Connections(transmitters, recievers);

const users = new Users(connections, transmitters, recievers);

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
        if (clientType === "transmitter") {
          console.log(`Registering transmitter ${clientId}`);
          transmitters.addClient(clientId, client, "available");
        } else if (clientType === "reciever") {
          console.log(`Registering reciever ${clientId}`);
          recievers.addClient(clientId, client, "available");
          users.broadcastRecievers(transmitters);
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
          case "transmitter":
            wsTransmitter({ type, payload, clientId, users });
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

    if (clientType === "transmitter") {
      if (parties) {
        const reciever = recievers.getClient(parties.recieverID);
        reciever.send(JSON.stringify({ type: "terminated" }));
      }
      transmitters.remove(clientId);
    } else if (clientType === "reciever") {
      if (parties) {
        const transmitter = transmitters.getClient(parties.transmitterID);
        transmitter.send(JSON.stringify({ type: "terminated" }));
      }
      recievers.remove(clientId);
    }
    users.broadcastRecievers(transmitters);
  });

  clientCounter++;
});

exports.wsServer = wsServer;
