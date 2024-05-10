import ReceiverEndpoint from "./api/components/receiver-endpoint.js";
import TransmitterEndpoint from "./api/components/transmitter-endpoint.js";

customElements.define("reciever-endpoint", ReceiverEndpoint);
customElements.define("transmitter-endpoint", TransmitterEndpoint);

const recieverEndpoint = document.querySelector("reciever-endpoint");
const transmitterEndpoint = document.querySelector("transmitter-endpoint");
