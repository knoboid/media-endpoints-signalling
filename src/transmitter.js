import TransmitterEndpoint from "./api/components/transmitter-endpoint.js";
import Transmitter from "./client/js/media-transmitter.js";

customElements.define("transmitter-endpoint", TransmitterEndpoint);
const transmitterElement = document.querySelector("transmitter-endpoint");
const callButton = document.querySelector("#call-button");
const callInput = document.querySelector("#call-input");

const transmitter = new Transmitter(null, null, null, onTransmitterReady);

callButton.onclick = () => {
  const receiverId = callInput.value;
  if (!isNaN(receiverId)) {
    call(receiverId);
  }
};

function onTransmitterReady(transmitterId) {
  transmitterElement.setId(transmitterId);
}

function call(receiverId) {
  const constraints = {
    audio: true,
    video: true,
  };
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    transmitter.attachStream(stream);
    transmitter.initiateCall(receiverId);
  });
}
