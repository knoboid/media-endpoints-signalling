import ClientGroups from "./groups/client-groups.js";
import Connections from "./groups/connections.js";
import WebSocketClient from "./client/WebSocketClient.js";
import Endpoint from "./client/Endpoint.js";

class ClientModel {
  constructor() {
    console.log("Creating new client model");
    this.clientGroups = new ClientGroups();
    this.connections = new Connections(this.clientGroups);
  }

  createTransmitter(id, webSocket) {
    return this.clientGroups.addClient(
      new Endpoint(id, "transmitter", webSocket)
    );
  }

  createReceiver(id, webSocket) {
    return this.clientGroups.addClient(new Endpoint(id, "receiver", webSocket));
  }

  createDataViewer(id, webSocket) {
    return this.clientGroups.addClient(
      new WebSocketClient(id, "dataViewer", webSocket)
    );
  }

  getClient(clientId) {
    const clientGroup = this.clientGroups.clientIdMap[clientId];
    return clientGroup.getClient(clientId);
  }

  deleteClient(clientId) {
    const clientGroup = this.clientGroups.clientIdMap[clientId];
    return clientGroup.removeClient(clientId);
  }

  broadcastToClientGroup(clientType, type, payload) {
    const clientGroup = this.clientGroups.clientGroupMap[clientType];
    clientGroup.getWebSockets().forEach((webSocket) => {
      webSocket.send(JSON.stringify({ type, payload }));
    });
  }
}

export default ClientModel;
