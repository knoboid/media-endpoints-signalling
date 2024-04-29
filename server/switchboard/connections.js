class Connections {
  constructor(callers, responders) {
    this.callers = callers;
    this.responders = responders;
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

  setConnection(callerID, responderID) {
    this.connections[this.newId()] = { callerID, responderID };
  }

  setCaller(callerID, responderID) {
    this.clients[callerID] = {
      type: "caller",
      connectionID: this.currentId(),
      otherPartyID: responderID,
    };
    this.callers.setStatus(callerID, "busy");
  }

  setResponder(responderID, callerID) {
    this.clients[responderID] = {
      type: "responder",
      connectionID: this.currentId(),
      otherPartyID: callerID,
    };
    this.responders.setStatus(responderID, "busy");
  }

  attempt(callerID, responderID) {
    const canConnect =
      this.callers.isAvailable(callerID) &&
      this.responders.isAvailable(responderID);
    if (canConnect) {
      this.setConnection(callerID, responderID);
      this.setCaller(callerID, responderID);
      this.setResponder(responderID, callerID);
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
      return this.responders.getClient(clientRecord.otherPartyID);
    } else if (clientRecord.type === "responder") {
      return this.callers.getClient(clientRecord.otherPartyID);
    }
  }

  terminate(clientID) {
    const connectionID = this.clients[clientID].connectionID;
    const { callerID, responderID } = this.connections[connectionID];
    delete this.connections[connectionID];
    delete this.clients[callerID];
    delete this.clients[responderID];
    this.callers.setStatus(callerID, "available");
    this.responders.setStatus(responderID, "available");
    return { callerID, responderID };
  }

  getClientStatus(clientID) {
    if (this.callers.contains(clientID)) {
      return this.callers.getStatus(clientID);
    } else if (this.responders.contains(clientID)) {
      return this.responders.getStatus(clientID);
    }
  }

  terminateIfBusy(clientID) {
    if (this.getClientStatus(clientID) === "busy") {
      return this.terminate(clientID);
    }
  }
}

module.exports = Connections;
