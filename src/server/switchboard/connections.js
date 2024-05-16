class Connections {
  constructor(transmitters, receivers) {
    this.transmitters = transmitters;
    this.receivers = receivers;
    this.connections = {};
    this.counter = 0;
    this.clients = {};
  }

  newId() {
    return ++this.counter;
  }

  currentId() {
    return this.counter;
  }

  setConnection(transmitterID, receiverID) {
    this.connections[this.newId()] = { transmitterID, receiverID };
  }

  setTransmitter(transmitterID, receiverID) {
    this.clients[transmitterID] = {
      type: "transmitter",
      connectionID: this.currentId(),
      otherPartyID: receiverID,
    };
    this.transmitters.setStatus(transmitterID, "busy");
  }

  setReciever(receiverID, transmitterID) {
    this.clients[receiverID] = {
      type: "receiver",
      connectionID: this.currentId(),
      otherPartyID: transmitterID,
    };
    this.receivers.setStatus(receiverID, "busy");
  }

  attempt(transmitterID, receiverID) {
    const canConnect =
      this.transmitters.isAvailable(transmitterID) &&
      this.receivers.isAvailable(receiverID);
    if (canConnect) {
      this.setConnection(transmitterID, receiverID);
      this.setTransmitter(transmitterID, receiverID);
      this.setReciever(receiverID, transmitterID);
      return true;
    }
    return false;
  }

  isConnected(clientID) {
    return typeof this.clients[clientID] === "object";
  }

  getOtherPartysSocket(clientID) {
    const clientRecord = this.clients[clientID];
    if (clientRecord.type === "transmitter") {
      return this.receivers.getClient(clientRecord.otherPartyID);
    } else if (clientRecord.type === "receiver") {
      return this.transmitters.getClient(clientRecord.otherPartyID);
    }
  }

  terminate(clientID) {
    const connectionID = this.clients[clientID].connectionID;
    const { transmitterID, receiverID } = this.connections[connectionID];
    delete this.connections[connectionID];
    delete this.clients[transmitterID];
    delete this.clients[receiverID];
    this.transmitters.setStatus(transmitterID, "available");
    this.receivers.setStatus(receiverID, "available");
    return { transmitterID, receiverID };
  }

  getClientStatus(clientID) {
    if (this.transmitters.contains(clientID)) {
      return this.transmitters.getStatus(clientID);
    } else if (this.receivers.contains(clientID)) {
      return this.receivers.getStatus(clientID);
    }
  }

  terminateIfBusy(clientID) {
    if (this.getClientStatus(clientID) === "busy") {
      return this.terminate(clientID);
    }
  }
}

module.exports = Connections;
