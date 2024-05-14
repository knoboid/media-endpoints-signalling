import { WebSocketServer } from "ws";

export const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", (client, req) => {
  console.log("connected");
});
