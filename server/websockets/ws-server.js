const ws = require("ws");
const Clients = require("../switchboard/clients");
const Connections = require("../switchboard/connections");
const wsAdmin = require("./ws-admin");

let clientCounter = 0;

const callers = new Clients();
const responders = new Clients();
const connections = new Connections(callers, responders);

const clientTypes = {};

const wsServer = new ws.Server({ noServer: true });

function broadcastResponders() {
  callers.getClients().forEach((client) => {
    client.send(
      JSON.stringify({
        type: "updateResponders",
        payload: { responders: responders.getList() },
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
        clientTypes[clientId] = clientType;
        if (clientType === "caller") {
          console.log(`Registering caller ${clientId}`);
          callers.addClient(clientId, client, "available");
        } else if (clientType === "responder") {
          console.log(`Registering responder ${clientId}`);
          responders.addClient(clientId, client, "available");
          broadcastResponders();
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
        switch (clientType) {
          case "admin":
            wsAdmin({ client, type, payload });
            break;
          default:
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
              case "initiateCall":
                /* first contact from a caller wishing to make a call */
                const { responderID } = payload;
                console.log(
                  `Preparing to initiate call  between ${clientId} and ${responderID}`
                );
                if (connections.attempt(clientId, responderID)) {
                  console.log("Responder is available");
                  client.send(
                    JSON.stringify({
                      type: "initiateCallSuccess",
                      payload: { responderID },
                    })
                  );
                  const responder = responders.getClient(responderID);
                  responder.send(
                    JSON.stringify({
                      type: "initiateResponse",
                      payload: { callerID: clientId },
                    })
                  );
                  broadcastResponders();
                } else {
                  console.log("Responder is NOT available");
                  client.send(
                    JSON.stringify({
                      type: "initiateCallFailure",
                      payload: { responderID },
                    })
                  );
                }
                break;

              case "fromCaller":
                console.log("Handling fromCaller");
                const responder = connections.getOtherPartysSocket(clientId);
                responder.send(JSON.stringify({ type, payload }));
                break;

              case "fromResponder":
                console.log("Handling fromResponder");
                const caller = connections.getOtherPartysSocket(clientId);
                caller.send(JSON.stringify({ type, payload }));
                break;

              case "terminated":
                console.log("Handling terminated");
                const parties = connections.terminate(clientId);
                if (clientType === "caller") {
                  const responder = responders.getClient(parties.responderID);
                  responder.send(JSON.stringify({ type: "terminated" }));
                } else if (clientType === "responder") {
                  const caller = callers.getClient(parties.callerID);
                  caller.send(JSON.stringify({ type: "terminated" }));
                }
                broadcastResponders();
                break;

              default:
                console.log(`UNHANDLED WS TYPE ${type}`);
                break;
            }
            break;
        }

        break;
    }
    messageCounter++;
  });

  client.on("close", () => {
    console.log(`Closing connection to ${clientType} with id: ${clientId}`);
    // TODO tidy up with any other parties
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

    broadcastResponders();
  });

  clientCounter++;
});

exports.wsServer = wsServer;
