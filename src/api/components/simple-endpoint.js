import SimpleReceiverEndpoint from "./simple-receiver-endpoint.js";
import SimpleTransmitterEndpoint from "./simple-transmitter-endpoint.js";

class SimpleEndpoint extends HTMLElement {
  constructor() {
    super();
    this.appendChild(new SimpleReceiverEndpoint());
    this.appendChild(document.createElement("hr"));
    this.appendChild(new SimpleTransmitterEndpoint());
  }
}

export default SimpleEndpoint;
