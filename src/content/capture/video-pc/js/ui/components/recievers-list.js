import PayloadEvent from "../../payload-event.js";

const delimiter = " ; ";

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

function appendContentTo(parent, type, content) {
  const element = document.createElement(type);
  element.innerHTML = content;
  parent.appendChild(element);
  return element;
}

export default RecieversList;
