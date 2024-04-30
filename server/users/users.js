class Users {
  constructor(connections, callers, recievers) {
    this.connections = connections;
    this.callers = callers;
    this.recievers = recievers;
  }

  getConnections() {
    return this.connections;
  }

  getCallers() {
    return this.callers;
  }

  getRecievers() {
    return this.recievers;
  }

  broadcastRecievers(recieverGroup) {
    recieverGroup.getClients().forEach((client) => {
      client.send(
        JSON.stringify({
          type: "updateRecievers",
          payload: { recievers: this.recievers.getList() },
        })
      );
    });
  }
}

module.exports = Users;
