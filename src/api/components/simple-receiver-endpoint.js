import ReceiverEndpoint from "./receiver-endpoint.js";
import Receiver from "../../client/js/media-reciever.js";

class SimpleReceiverEndpoint extends ReceiverEndpoint {
  constructor() {
    super();
    new Receiver(
      null,
      this.videoElement,
      null,
      (id) => this.onReceiverReady(id),
      null
    );
  }

  onReceiverReady(receiverId) {
    this.setId(receiverId);
  }
}

export default SimpleReceiverEndpoint;
