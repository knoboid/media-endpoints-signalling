import { appendContentTo } from "../util.js";

class SwitchboardComponent extends HTMLElement {
  constructor() {
    super();
    this.div = document.createElement("div");
    this.div.innerHTML = "testing";
    this.usersTable = document.createElement("table");
    this.appendChild(this.div);
    this.appendChild(this.usersTable);
    this.callFrom = document.createElement("div");
    this.callTo = document.createElement("div");
    this.renderCallFrom();
    this.renderCallTo();
    this.appendChild(this.callFrom);
    this.appendChild(this.callTo);
    this.callButton = document.createElement("button");
    this.callButton.innerHTML = "CALL";
    this.callButton["data-type"] = "call-button";
    this.appendChild(this.callButton);
  }

  updateUsers(users) {
    console.log(users);
    this.usersTable.innerHTML = null;
    const heading = document.createElement("tr");
    heading.innerHTML = "<td>From</td><td>To</td>";
    this.usersTable.appendChild(heading);
    users.forEach((user) => {
      const row = document.createElement("tr");
      const fromTd = document.createElement("button");
      fromTd["data-type"] = "from";
      fromTd["data-user"] = user.id;
      fromTd.innerHTML = user.id;
      const toTd = document.createElement("button");
      toTd["data-type"] = "to";
      toTd["data-user"] = user.id;
      toTd.innerHTML = user.id;
      row.appendChild(fromTd);
      row.appendChild(toTd);
      this.usersTable.appendChild(row);
    });
    console.log(this.usersTable);
  }

  renderCallFrom(id) {
    this.fromId = typeof id === "undefined" ? "?" : id;
    this.callFrom.innerHTML = `Call From: ${this.fromId}`;
  }

  renderCallTo(id) {
    this.toId = typeof id === "undefined" ? "?" : id;
    this.callTo.innerHTML = `Call To: ${this.toId}`;
  }

  canCall() {
    return !isNaN(this.fromId) && !isNaN(this.toId);
  }

  callData() {
    return { transmittingUserId: this.fromId, receivingUserId: this.toId };
  }
}

export default SwitchboardComponent;
