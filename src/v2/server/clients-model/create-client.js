import Endpoint from "./client/Endpoint.js";

let id = 1;

export function createReceiver(webSocket) {
  return new Endpoint(id++, "receiver", webSocket);
}

export function createTransmitter(webSocket) {
  return new Endpoint(id++, "transmitter", webSocket);
}
