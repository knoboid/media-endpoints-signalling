import PayloadEvent from "../../payload-event.js";

class RecieverSignaller extends EventTarget {
  constructor(signallingChannel) {
    super();
    this.signallingChannel = signallingChannel;
    this.signallingChannel.addEventListener("fromTransmitter", (event) =>
      this.dispatchEvent(new PayloadEvent("fromTransmitter", event.data))
    );
  }

  receiver(data) {
    this.signallingChannel.receiver(data);
  }
}

export default RecieverSignaller;
