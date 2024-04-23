let connections = [];

class ConnectionRegistry {
  constructor(peerRegistry) {
    this.peerRegistry = peerRegistry;
  }

  connect(fromName, toName) {
    connections.push({
      from: fromName,
      to: toName,
    });
  }

  getOtherPeer(name) {
    for (const connection of connections) {
      if (name === connection.from) {
        console.log(this.peerRegistry.getPeer(connection.to));
        return this.peerRegistry.getPeer(connection.to);
      } else if (name === connection.to) {
        return this.peerRegistry.getPeer(connection.from);
      }
    }
  }
}

export default ConnectionRegistry;
