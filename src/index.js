import ReceiverEndpoint from "./api/components/receiver-endpoint.js";
import TransmitterEndpoint from "./api/components/transmitter-endpoint.js";
import Receiver from "./client/js/media-reciever.js";
import Transmitter from "./client/js/media-transmitter.js";

customElements.define("reciever-endpoint", ReceiverEndpoint);
customElements.define("transmitter-endpoint", TransmitterEndpoint);

const recieverEndpoint = document.querySelector("reciever-endpoint");
const transmitterEndpoint = document.querySelector("transmitter-endpoint");

let receiver,
  receiverId = null;
let transmitter,
  transmitterId = null;

function onReceiverReady(e) {
  receiverId = e;
  if (transmitterId !== null) onBothReady();
}

function onTransmitterReady(e) {
  transmitterId = e;
  if (receiverId !== null) onBothReady();
}

function onBothReady() {
  console.log(`Receiver id: ${receiverId}\nTransmitter id: ${transmitterId}`);
}

receiver = new Receiver(null, null, null, onReceiverReady, null);

setTimeout(() => {
  transmitter = new Transmitter(null, null, null, onTransmitterReady);
}, 500);
