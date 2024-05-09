import PayloadEvent from "../../payload-event.js";

class TransmitterSignaller extends EventTarget {
  constructor(signallingChannel) {
    super();
    this.signallingChannel = signallingChannel;
    this.signallingChannel.addEventListener("fromReciever", (event) =>
      this.dispatchEvent(new PayloadEvent("fromReciever", event.data))
    );
  }

  transmitter(data) {
    this.signallingChannel.transmitter(data);
  }
}

export default TransmitterSignaller;
