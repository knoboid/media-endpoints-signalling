class ClientGroups {
  constructor(connections, transmitters, receivers) {
    this.connections = connections;
    this.transmitters = transmitters;
    this.receivers = receivers;
  }

  getConnections() {
    return this.connections;
  }

  getTransmitters() {
    return this.transmitters;
  }

  getRecievers() {
    return this.receivers;
  }

  broadcastRecievers(receiverGroup) {
    receiverGroup.getClients().forEach((client) => {
      client.send(
        JSON.stringify({
          type: "updateRecievers",
          payload: { receivers: this.receivers.getList() },
        })
      );
    });
  }
}

module.exports = ClientGroups;
