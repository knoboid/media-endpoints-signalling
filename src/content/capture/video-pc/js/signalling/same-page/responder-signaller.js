import PayloadEvent from "../../payload-event.js";

class RecieverSignaller extends EventTarget {
  constructor(signallingChannel) {
    super();
    this.signallingChannel = signallingChannel;
    this.signallingChannel.addEventListener("fromTransmitter", (event) =>
      this.dispatchEvent(new PayloadEvent("fromTransmitter", event.data))
    );
  }

  reciever(data) {
    this.signallingChannel.reciever(data);
  }
}

export default RecieverSignaller;
