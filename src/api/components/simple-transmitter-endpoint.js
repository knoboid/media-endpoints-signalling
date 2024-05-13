import TransmitterEndpoint from "./transmitter-endpoint.js";
import Transmitter from "../../client/js/media-transmitter.js";

class SimpleTransmitterEndpoint extends TransmitterEndpoint {
  constructor() {
    super();
    this.input = document.createElement("input");
    this.input.type = "text";
    this.button = document.createElement("button");
    this.button.innerHTML = "Call";
    this.appendChild(document.createElement("hr"));
    this.appendChild(this.input);
    this.appendChild(this.button);

    this.transmitter = new Transmitter(null, null, null, (id) =>
      this.onTransmitterReady(id)
    );

    this.onclick = () => {
      const receiverId = this.input.value;
      if (!isNaN(receiverId)) {
        this.call(receiverId);
      }
    };
  }

  onTransmitterReady(transmitterId) {
    this.setId(transmitterId);
  }

  call(receiverId) {
    const constraints = {
      audio: true,
      video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.transmitter.attachStream(stream);
      this.transmitter.initiateCall(receiverId);
    });
  }
}

export default SimpleTransmitterEndpoint;
