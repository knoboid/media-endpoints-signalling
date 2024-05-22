import ClientGroup from "./client-group.js";

class ClientGroups {
  constructor() {
    this.clientGroups = [];
    this.clientGroupMap = {};
    this.clientTypes = [];
    this.clientIdMap = {};
  }

  addClient(client) {
    const id = client.getId();
    if (this.includesClient(id))
      throw new Error(`Client with id ${id} in client groups already exists.`);
    const clientType = client.getClientType();
    if (!this.includes(clientType)) {
      const newClientGroup = new ClientGroup(clientType);
      this.clientGroups.push(newClientGroup);
      this.clientGroupMap[clientType] = newClientGroup;
      this.clientTypes.push(clientType);
    }
    const clientGroup = this.getGroup(clientType);
    clientGroup.addClient(client);
    this.clientIdMap[id] = clientGroup;
    return client;
  }

  getGroup(clientType) {
    return this.clientGroupMap[clientType];
  }

  getGroups() {
    return this.clientGroups;
  }

  getGroupsObject() {
    return this.clientTypes.reduce((acc, clientType) => {
      acc[clientType] = this.getGroup(clientType).getClientObjects();
      return acc;
    }, {});
  }

  includes(clientType) {
    return this.clientTypes.includes(clientType);
  }

  includesClient(clientId) {
    return Object.keys(this.clientIdMap).includes(clientId + "");
  }
}

export default ClientGroups;
