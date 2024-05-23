import WebSocketClient from "./WebSocketClient.js";

class Endpoint extends WebSocketClient {
  constructor(id, clientType, webSocket) {
    super(id, clientType, webSocket);
    this.otherParty = null;
    this.connectionId = null;
  }

  isReceiver() {
    return this.getClientType() === "receiver";
  }

  isTransmitter() {
    return this.getClientType() === "transmitter";
  }

  getObject() {
    return { ...super.getObject(), otherParty: this.otherParty };
  }

  setConnection(otherParty, connectionId) {
    this.otherParty = otherParty;
    this.connectionId = connectionId;
  }

  disconnect() {
    this.setConnection(null, null);
  }

  isEngaged() {
    return this.otherParty !== null;
  }
}

export default Endpoint;
