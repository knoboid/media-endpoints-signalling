import { WebSocketServer } from "ws";
import messageHandlers from "./messaging/message-handlers/message-handlers.js";
import ClientGroup from "../endpoints/client-group.js";

const transmitters = new ClientGroup();
const receivers = new ClientGroup();
const clientGroups = { transmitters, receivers };

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
    clientType = clientType_;
    messageHandlers({
      webSocket,
      clientId,
      clientGroups,
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
