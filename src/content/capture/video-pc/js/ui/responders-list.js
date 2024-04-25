import PayloadEvent from "../payload-event.js";

const delimiter = " ; ";

class RespondersList extends EventTarget {
  constructor(element) {
    super();
    this.element = element;
    this.element.innerHTML = "empty";
    this.counter = 0;
  }

  render(responders) {
    this.element.innerHTML = "";
    responders.forEach((responder) => {
      const row = document.createElement("div");
      appendContentTo(row, "span", responder.id + delimiter);
      appendContentTo(row, "span", responder.status + delimiter);
      const callButton = appendContentTo(row, "button", "Call");
      const hangupButton = appendContentTo(row, "button", "Hangup");
      hangupButton.disabled = true;
      callButton.onclick = (e) => {
        this.dispatchEvent(new PayloadEvent("call", responder.id));
        hangupButton.disabled = false;
        callButton.disabled = true;
      };
      hangupButton.onclick = (e) => {
        this.dispatchEvent(new PayloadEvent("hangup", responder.id));
        hangupButton.disabled = true;
        callButton.disabled = false;
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

export default RespondersList;
