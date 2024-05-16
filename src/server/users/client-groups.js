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

  getReceivers() {
    return this.receivers;
  }

  broadcastReceivers(receiverGroup) {
    receiverGroup.getClients().forEach((client) => {
      client.send(
        JSON.stringify({
          type: "updateReceivers",
          payload: { receivers: this.receivers.getList() },
        })
      );
    });
  }
}

module.exports = ClientGroups;
