import { ReceiverRow } from "./receiver-row.js";

export class ReceiversList extends HTMLElement {
  constructor() {
    super();
  }

  setData(data) {
    this.innerHTML = "";
    data.forEach((item) => {
      const rowElement = new ReceiverRow(item);
      this.appendChild(rowElement);
    });
  }
}

export default ReceiversList;
