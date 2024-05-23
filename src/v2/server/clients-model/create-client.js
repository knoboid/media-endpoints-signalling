import ClientGroups from "./groups/client-groups.js";
import Connections from "./groups/connections.js";
import WebSocketClient from "./client/WebSocketClient.js";
import Endpoint from "./client/Endpoint.js";

let id = 1;

export const clientGroups = new ClientGroups();
export const connections = new Connections(clientGroups);

export function createTransmitter(webSocket) {
  return clientGroups.addClient(new Endpoint(id++, "transmitter", webSocket));
}

export function createReceiver(webSocket) {
  return clientGroups.addClient(new Endpoint(id++, "receiver", webSocket));
}

export function createDataViewer(webSocket) {
  return clientGroups.addClient(
    new WebSocketClient(id++, "dataViewer", webSocket)
  );
}

export function getClient(clientId) {
  const clientGroup = clientGroups.clientIdMap[clientId];
  return clientGroup.getClient(clientId);
}

export function deleteClient(clientId) {
  const clientGroup = clientGroups.clientIdMap[clientId];
  return clientGroup.removeClient(clientId);
}
