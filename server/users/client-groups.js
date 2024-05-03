class ClientGroups {
  constructor(connections, transmitters, recievers) {
    this.connections = connections;
    this.transmitters = transmitters;
    this.recievers = recievers;
  }

  getConnections() {
    return this.connections;
  }

  getTransmitters() {
    return this.transmitters;
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

module.exports = ClientGroups;
