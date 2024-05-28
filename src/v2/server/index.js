import https from "https";
import express from "express";
import { credentials } from "./security/https-credentials.js";
import { wsServer } from "./ws/ws-server.js";

export function startServer(appPath = "./src") {
  const app = express();

  app.use(express.static(appPath));

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(5502);

  httpsServer.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request);
    });
  });
}
