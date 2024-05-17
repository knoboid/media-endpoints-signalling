import SimpleReceiverEndpoint from "./simple-receiver-endpoint.js";
import SimpleTransmitterEndpoint from "./simple-transmitter-endpoint.js";

class InfiniteEndpoints extends HTMLElement {
  constructor() {
    super();

    this.addReceiverButton = document.createElement("button");
    this.addReceiverButton.innerHTML = "Add Receiver";
    this.appendChild(this.addReceiverButton);
    this.addReceiverButton.onclick = () => {
      this.appendChild(document.createElement("hr"));
      this.appendChild(new SimpleReceiverEndpoint());
    };

    this.addTransmittererButton = document.createElement("button");
    this.addTransmittererButton.innerHTML = "Add Transmitter";
    this.appendChild(this.addTransmittererButton);
    this.addTransmittererButton.onclick = () => {
      this.appendChild(document.createElement("hr"));
      this.appendChild(new SimpleTransmitterEndpoint());
    };
  }
}

export default InfiniteEndpoints;
