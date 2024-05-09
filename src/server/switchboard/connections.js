class Connections {
  constructor(transmitters, recievers) {
    this.transmitters = transmitters;
    this.recievers = recievers;
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

  setConnection(transmitterID, recieverID) {
    this.connections[this.newId()] = { transmitterID, recieverID };
  }

  setTransmitter(transmitterID, recieverID) {
    this.clients[transmitterID] = {
      type: "transmitter",
      connectionID: this.currentId(),
      otherPartyID: recieverID,
    };
    this.transmitters.setStatus(transmitterID, "busy");
  }

  setReciever(recieverID, transmitterID) {
    this.clients[recieverID] = {
      type: "reciever",
      connectionID: this.currentId(),
      otherPartyID: transmitterID,
    };
    this.recievers.setStatus(recieverID, "busy");
  }

  attempt(transmitterID, recieverID) {
    const canConnect =
      this.transmitters.isAvailable(transmitterID) &&
      this.recievers.isAvailable(recieverID);
    if (canConnect) {
      this.setConnection(transmitterID, recieverID);
      this.setTransmitter(transmitterID, recieverID);
      this.setReciever(recieverID, transmitterID);
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
      return this.recievers.getClient(clientRecord.otherPartyID);
    } else if (clientRecord.type === "reciever") {
      return this.transmitters.getClient(clientRecord.otherPartyID);
    }
  }

  terminate(clientID) {
    const connectionID = this.clients[clientID].connectionID;
    const { transmitterID, recieverID } = this.connections[connectionID];
    delete this.connections[connectionID];
    delete this.clients[transmitterID];
    delete this.clients[recieverID];
    this.transmitters.setStatus(transmitterID, "available");
    this.recievers.setStatus(recieverID, "available");
    return { transmitterID, recieverID };
  }

  getClientStatus(clientID) {
    if (this.transmitters.contains(clientID)) {
      return this.transmitters.getStatus(clientID);
    } else if (this.recievers.contains(clientID)) {
      return this.recievers.getStatus(clientID);
    }
  }

  terminateIfBusy(clientID) {
    if (this.getClientStatus(clientID) === "busy") {
      return this.terminate(clientID);
    }
  }
}

module.exports = Connections;
