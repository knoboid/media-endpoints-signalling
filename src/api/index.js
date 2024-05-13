import ReceiverEndpoint from "./components/receiver-endpoint.js";
import TransmitterEndpoint from "./components/transmitter-endpoint.js";
import SimpleReceiverEndpoint from "./components/simple-receiver-endpoint.js";
import SimpleTransmitterEndpoint from "./components/simple-transmitter-endpoint.js";

export function defineCustomElements() {
  customElements.define("reciever-endpoint", ReceiverEndpoint);
  customElements.define("transmitter-endpoint", TransmitterEndpoint);
  customElements.define("simple-reciever-endpoint", SimpleReceiverEndpoint);
  customElements.define(
    "simple-transmitter-endpoint",
    SimpleTransmitterEndpoint
  );
}
