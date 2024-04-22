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
    console.log(name);
    console.log(connections[0]);
    for (const connection of connections) {
      // console.log(connection);
      if (name === connection.from) {
        console.log("fromname match");
        console.log(`other peer name: ${connection.to}`);
        console.log(this.peerRegistry.getPeer(connection.to));
        return this.peerRegistry.getPeer(connection.to);
      } else if (name === connection.to) {
        console.log("toname match");
        console.log(`other peer name: ${connection.from}`);
        console.log(this.peerRegistry.getPeer(connection.from));
        return this.peerRegistry.getPeer(connection.from);
      }
    }
  }
}

export default ConnectionRegistry;
