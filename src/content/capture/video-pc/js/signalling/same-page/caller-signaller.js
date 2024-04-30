import PayloadEvent from "../../payload-event.js";

class CallerSignaller extends EventTarget {
  constructor(signallingChannel) {
    super();
    this.signallingChannel = signallingChannel;
    this.signallingChannel.addEventListener("fromReciever", (event) =>
      this.dispatchEvent(new PayloadEvent("fromReciever", event.data))
    );
  }

  caller(data) {
    this.signallingChannel.caller(data);
  }
}

export default CallerSignaller;
