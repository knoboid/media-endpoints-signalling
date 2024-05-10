import ReceiverEndpoint from "./api/components/receiver-endpoint.js";
import TransmitterEndpoint from "./api/components/transmitter-endpoint.js";
import Receiver from "./client/js/media-reciever.js";

customElements.define("reciever-endpoint", ReceiverEndpoint);
customElements.define("transmitter-endpoint", TransmitterEndpoint);

const recieverEndpoint = document.querySelector("reciever-endpoint");
const transmitterEndpoint = document.querySelector("transmitter-endpoint");

let receiverId;
function onready(e) {
  receiverId = e.data;
}

const receiver = new Receiver(null, null, null, onready, null);
