import ReceiverEndpoint from "./receiver-endpoint.js";
import Receiver from "../../v2/client/receiver.js";

class SimpleReceiverEndpoint extends ReceiverEndpoint {
  constructor() {
    super();
    this.receiver = new Receiver(
      null,
      this.videoElement,
      null,
      (id) => this.onReceiverReady(id),
      null
    );
    this.br = document.createElement("br");
    this.hangupButton = document.createElement("button");
    this.hangupButton.innerHTML = "Hangup";
    this.appendChild(this.br);
    this.appendChild(this.hangupButton);

    this.hangupButton.onclick = () => {
      this.receiver.hangup();
    };
  }

  onReceiverReady(receiverId) {
    this.setId(receiverId);
  }
}

export default SimpleReceiverEndpoint;
