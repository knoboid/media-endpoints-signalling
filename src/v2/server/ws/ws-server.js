import { WebSocketServer } from "ws";
import messageHandlers from "./message-handlers/message-handlers.js";

let clientCounter = 0;

export const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", (client, req) => {
  console.log("connected");
  const clientId = clientCounter;
  let messageCounter = 0;
  let clientType;
  client.send(JSON.stringify({ type: "clientId", payload: { clientId } }));

  client.on("message", (message) => {
    const {
      clientType: clientType_,
      type,
      payload,
    } = JSON.parse(message.toString());
    clientType = clientType_;
    messageHandlers({ messageCounter, clientType, type, payload });
    messageCounter++;
  });

  client.on("close", () => {});

  clientCounter++;
});
