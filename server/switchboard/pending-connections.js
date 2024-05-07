class PendingConnections {
  constructor(users) {
    this.users = users;
    this.pendingConnections = {};
  }

  add(userId, transmitterId, receivingUserId) {
    if (this.users.userOwnsTransmitter(userId, transmitterId)) {
      const uuid = crypto.randomUUID();
      this.pendingConnections[uuid] = new PendingConnection(
        uuid,
        userId,
        transmitterId,
        receivingUserId
      );
      return uuid;
    }
    return false;
  }

  addReceiverId(uuid, receiverId) {
    this.get(uuid).addReceiverId(receiverId);
  }

  get(uuid) {
    return this.pendingConnections[uuid];
  }
}

class PendingConnection {
  constructor(uuid, userId, transmitterId, receivingUserId) {
    this.uuid = uuid;
    this.userId = userId;
    this.transmitterId = transmitterId;
    this.receivingUserId = receivingUserId;
  }

  addReceiverId(receiverId) {
    this.receiverId = receiverId;
  }
}

module.exports = PendingConnections;
