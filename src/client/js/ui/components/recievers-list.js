import { ReciverRow } from "./receiver-row.js";

export class RecieversList extends HTMLElement {
  constructor() {
    super();
  }

  setData(data) {
    this.innerHTML = "";
    data.forEach((item) => {
      const rowElement = new ReciverRow(item);
      this.appendChild(rowElement);
    });
  }
}

export default RecieversList;
