import ReceiverEndpoint from "./api/components/receiver-endpoint.js";
import TransmitterEndpoint from "./api/components/transmitter-endpoint.js";
import Receiver from "./client/js/media-reciever.js";
import Transmitter from "./client/js/media-transmitter.js";

customElements.define("reciever-endpoint", ReceiverEndpoint);
customElements.define("transmitter-endpoint", TransmitterEndpoint);

const recieverEndpoint = document.querySelector("reciever-endpoint");
const transmitterEndpoint = document.querySelector("transmitter-endpoint");

let receiver,
  receiverId = null,
  video;
let transmitter,
  transmitterId = null;

function onReceiverReady(e) {
  receiverId = e;
  video = recieverEndpoint.videoElement;
  if (transmitterId !== null) onBothReady();
}

function onTransmitterReady(e) {
  transmitterId = e;
  if (receiverId !== null) onBothReady();
}

function onBothReady() {
  const constraints = {
    audio: true,
    video: true,
  };
  console.log(`Receiver id: ${receiverId}\nTransmitter id: ${transmitterId}`);
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    transmitter.attachStream(stream);
    transmitter.initiateCall(receiverId);
  });
}

receiver = new Receiver(null, video, null, onReceiverReady, null);

setTimeout(() => {
  transmitter = new Transmitter(null, null, null, onTransmitterReady);
}, 500);
