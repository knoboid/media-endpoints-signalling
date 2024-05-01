import PayloadEvent from "../../payload-event.js";
import { appendContentTo } from "../util.js";

const delimiter = " ; ";

export class ReciverRow extends HTMLElement {
  constructor(rowData) {
    super();
    const row = document.createElement("div");
    appendContentTo(row, "span", rowData.id + delimiter);
    appendContentTo(row, "span", rowData.status + delimiter);
    const callButton = appendContentTo(row, "button", "Call");
    const hangupButton = appendContentTo(row, "button", "Hangup");
    callButton.onclick = (e) => {
      this.dispatchEvent(new PayloadEvent("call", rowData.id));
    };
    hangupButton.onclick = (e) => {
      this.dispatchEvent(new PayloadEvent("hangup", rowData.id));
    };
    this.appendChild(row);
  }
}

export default ReciverRow;
