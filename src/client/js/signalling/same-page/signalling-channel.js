import PayloadEvent from "../../payload-event.js";

class SignallingChannel extends EventTarget {
  constructor() {
    super();
  }

  transmitter(data) {
    this.dispatchEvent(new PayloadEvent("fromTransmitter", data));
  }

  receiver(data) {
    this.dispatchEvent(new PayloadEvent("fromReciever", data));
  }
}

export default SignallingChannel;
