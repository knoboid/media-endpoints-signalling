class Users {
  constructor(connections, callers, responders) {
    this.connections = connections;
    this.callers = callers;
    this.responders = responders;
  }

  getConnections() {
    return this.connections;
  }

  getCallers() {
    return this.callers;
  }

  getResponders() {
    return this.responders;
  }
}

module.exports = Users;
