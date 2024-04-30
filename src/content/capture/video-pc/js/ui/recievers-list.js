import PayloadEvent from "../payload-event.js";

const delimiter = " ; ";

class RecieversList extends EventTarget {
  constructor(element) {
    super();
    this.element = element;
    this.element.innerHTML = "empty";
    this.counter = 0;
  }

  render(recievers) {
    this.element.innerHTML = "";
    recievers.forEach((reciever) => {
      const row = document.createElement("div");
      appendContentTo(row, "span", reciever.id + delimiter);
      appendContentTo(row, "span", reciever.status + delimiter);
      const callButton = appendContentTo(row, "button", "Call");
      const hangupButton = appendContentTo(row, "button", "Hangup");
      callButton.onclick = (e) => {
        this.dispatchEvent(new PayloadEvent("call", reciever.id));
      };
      hangupButton.onclick = (e) => {
        this.dispatchEvent(new PayloadEvent("hangup", reciever.id));
      };
      this.element.appendChild(row);
    });
  }
}

function appendContentTo(parent, type, content) {
  const element = document.createElement(type);
  element.innerHTML = content;
  parent.appendChild(element);
  return element;
}

export default RecieversList;
