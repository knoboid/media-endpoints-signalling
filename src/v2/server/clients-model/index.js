import ClientGroups from "./groups/client-groups.js";
import Connections from "./groups/connections.js";
import WebSocketClient from "./client/WebSocketClient.js";
import Endpoint from "./client/Endpoint.js";

export const clientGroups = new ClientGroups();
export const connections = new Connections(clientGroups);

// export function createTransmitter(id, webSocket) {
//   return clientGroups.addClient(new Endpoint(id, "transmitter", webSocket));
// }

// export function createReceiver(id, webSocket) {
//   return clientGroups.addClient(new Endpoint(id, "receiver", webSocket));
// }

// export function createDataViewer(id, webSocket) {
//   return clientGroups.addClient(
//     new WebSocketClient(id, "dataViewer", webSocket)
//   );
// }

// export function getClient(clientId) {
//   const clientGroup = clientGroups.clientIdMap[clientId];
//   return clientGroup.getClient(clientId);
// }

// export function deleteClient(clientId) {
//   const clientGroup = clientGroups.clientIdMap[clientId];
//   return clientGroup.removeClient(clientId);
// }

class ClientModel {
  constructor() {
    this.clientGroups = new ClientGroups();
    this.connections = new Connections(clientGroups);
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
}

export default ClientModel;
