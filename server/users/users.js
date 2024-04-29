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

  broadcastResponders(recieverGroup) {
    recieverGroup.getClients().forEach((client) => {
      client.send(
        JSON.stringify({
          type: "updateResponders",
          payload: { responders: this.responders.getList() },
        })
      );
    });
  }
}

module.exports = Users;
