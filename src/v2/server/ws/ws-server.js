import { WebSocketServer } from "ws";
import messageHandlers from "./messaging/message-handlers/message-handlers.js";
import ClientGroup from "../endpoints/client-group.js";
import Connections from "../endpoints/connections.js";

const transmitters = new ClientGroup();
const receivers = new ClientGroup();
const dataViewers = new ClientGroup();
const connections = new Connections(transmitters, receivers);
const clientGroups = { transmitters, receivers, dataViewers };

let clientCounter = 0;

export const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", (webSocket, req) => {
  console.log("connected");
  const clientId = clientCounter;
  let messageCounter = 0;
  let clientType;
  webSocket.send(JSON.stringify({ type: "clientId", payload: { clientId } }));

  webSocket.on("message", (message) => {
    const {
      clientType: clientType_,
      type,
      payload,
    } = JSON.parse(message.toString());
    if (clientType_) {
      clientType = clientType_;
    }
    messageHandlers({
      webSocket,
      clientId,
      clientGroups,
      connections,
      messageCounter,
      clientType,
      type,
      payload,
      message,
    });
    messageCounter++;
  });

  webSocket.on("close", () => {});

  clientCounter++;
});
