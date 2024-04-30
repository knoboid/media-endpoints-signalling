class Connections {
  constructor(callers, recievers) {
    this.callers = callers;
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

  setConnection(callerID, recieverID) {
    this.connections[this.newId()] = { callerID, recieverID };
  }

  setCaller(callerID, recieverID) {
    this.clients[callerID] = {
      type: "caller",
      connectionID: this.currentId(),
      otherPartyID: recieverID,
    };
    this.callers.setStatus(callerID, "busy");
  }

  setReciever(recieverID, callerID) {
    this.clients[recieverID] = {
      type: "reciever",
      connectionID: this.currentId(),
      otherPartyID: callerID,
    };
    this.recievers.setStatus(recieverID, "busy");
  }

  attempt(callerID, recieverID) {
    const canConnect =
      this.callers.isAvailable(callerID) &&
      this.recievers.isAvailable(recieverID);
    if (canConnect) {
      this.setConnection(callerID, recieverID);
      this.setCaller(callerID, recieverID);
      this.setReciever(recieverID, callerID);
      return true;
    }
    return false;
  }

  isConnected(clientID) {
    return typeof this.clients[clientID] === "object";
  }

  getOtherPartysSocket(clientID) {
    const clientRecord = this.clients[clientID];
    if (clientRecord.type === "caller") {
      return this.recievers.getClient(clientRecord.otherPartyID);
    } else if (clientRecord.type === "reciever") {
      return this.callers.getClient(clientRecord.otherPartyID);
    }
  }

  terminate(clientID) {
    const connectionID = this.clients[clientID].connectionID;
    const { callerID, recieverID } = this.connections[connectionID];
    delete this.connections[connectionID];
    delete this.clients[callerID];
    delete this.clients[recieverID];
    this.callers.setStatus(callerID, "available");
    this.recievers.setStatus(recieverID, "available");
    return { callerID, recieverID };
  }

  getClientStatus(clientID) {
    if (this.callers.contains(clientID)) {
      return this.callers.getStatus(clientID);
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
