import ReceiverEndpoint from "./components/api/receiver-endpoint.js";
import TransmitterEndpoint from "./components/api/transmitter-endpoint.js";

customElements.define("reciever-endpoint", ReceiverEndpoint);
customElements.define("transmitter-endpoint", TransmitterEndpoint);

const recieverEndpoint = document.querySelector("reciever-endpoint");
const transmitterEndpoint = document.querySelector("transmitter-endpoint");
