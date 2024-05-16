const ws = require("ws");
const Clients = require("../switchboard/clients");
const Connections = require("../switchboard/connections");
const wsAdmin = require("./ws-admin");
const wsReceiver = require("./ws-receiver");
const wsTransmitter = require("./ws-transmitter");
const wsUser = require("./user-ws-server");
const ClientGroups = require("../users/client-groups");
const Users = require("../users/users");
const RedeemCodes = require("../RedeemCodes");
const PendingConnections = require("../switchboard/pending-connections.js");

let clientCounter = 0;

const transmitters = new Clients();
const receivers = new Clients();
const connections = new Connections(transmitters, receivers);
const redeemCodes = new RedeemCodes();

const clientGroups = new ClientGroups(connections, transmitters, receivers);
const users = new Users();
const pendingConnections = new PendingConnections(users);

const clientTypes = {};

const wsServer = new ws.Server({ noServer: true });
// const wsServer = new ws.Server();
console.log("wsServer");

wsServer.on("connection", (client, req) => {
  const initialRequest = req;
  const clientId = clientCounter;
  let messageCounter = 0;
  let clientType;

  client.send(JSON.stringify({ type: "clientId", payload: { clientId } }));

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
          if (object.code) {
            const result = redeemCodes.redeem(object.code);
            if (result.type === "registerTransmitter") {
              transmitters.addClient(clientId, client, "available");
              const userId = result.clientId;
              users.addTransmitter(userId, clientId);
            }
          } else {
            transmitters.addClient(clientId, client, "available");
          }
        } else if (clientType === "receiver") {
          console.log(object);
          if (object.code) {
            const result = redeemCodes.redeem(object.code);
            if (result.type === "registerReceiver") {
              receivers.addClient(clientId, client, "available");
              const userId = result.clientId;
              users.addReceiver(userId, clientId);
              client.send(JSON.stringify({ type: "receiverRegistered" }));
            }
          } else {
            // userless endpoint mode
            receivers.addClient(clientId, client, "available");
            client.send(JSON.stringify({ type: "receiverRegistered" }));
          }

          //console.log(`Registering receiver ${clientId}`);
          //receivers.addClient(clientId, client, "available");
          //clientGroups.broadcastReceivers(transmitters);
        } else if (clientType === "user") {
          console.log(`Registering user ${clientId}`);
          users.addUser(clientId, client);
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
            wsAdmin({ client, type, payload, users, connections });
            break;
          case "receiver":
            wsReceiver({ type, payload, clientId, userGroups: clientGroups });
            break;
          case "transmitter":
            wsTransmitter({
              type,
              payload,
              clientId,
              userGroups: clientGroups,
              pendingConnections,
            });
            break;
          case "user":
            wsUser({
              client,
              type,
              payload,
              clientId,
              redeemCodes,
              users,
              pendingConnections,
            });
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
        const receiver = receivers.getClient(parties.receiverID);
        receiver.send(JSON.stringify({ type: "terminated" }));
      }
      transmitters.remove(clientId);
    } else if (clientType === "receiver") {
      if (parties) {
        const transmitter = transmitters.getClient(parties.transmitterID);
        transmitter.send(JSON.stringify({ type: "terminated" }));
      }
      receivers.remove(clientId);
    } else if (clientType === "user") {
      users.removeUser(clientId);
    }
    clientGroups.broadcastReceivers(transmitters);
  });

  clientCounter++;
});

exports.wsServer = wsServer;
