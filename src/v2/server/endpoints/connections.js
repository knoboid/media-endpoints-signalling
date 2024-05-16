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
    this.receivers.setStatus(recieverID, "busy");
  }

  attempt(transmitterID, recieverID) {
    if (!this.transmitters.isMember(transmitterID)) return false;
    if (!this.receivers.isMember(recieverID)) return false;
    const canConnect =
      this.transmitters.isAvailable(transmitterID) &&
      this.receivers.isAvailable(recieverID);
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
      return this.receivers.getClient(clientRecord.otherPartyID);
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
    this.receivers.setStatus(recieverID, "available");
    return { transmitterID, recieverID };
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

export default Connections;
