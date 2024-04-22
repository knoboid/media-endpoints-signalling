let peers = [];

class PeerRegistry {
  addPeer(peer) {
    peers.push(peer);
  }

  getPeer(name) {
    for (const peer of peers) {
      if (peer.name === name) return peer;
    }
  }

  setConnection(name, peerConnection) {
    this.getPeer(name).setPeerConnection(peerConnection);
  }

  getConnection(name) {
    return this.getPeer(name).getPeerConnection();
  }
}

export default PeerRegistry;
