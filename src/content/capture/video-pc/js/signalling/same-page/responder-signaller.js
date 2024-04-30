import PayloadEvent from "../../payload-event.js";

class RecieverSignaller extends EventTarget {
  constructor(signallingChannel) {
    super();
    this.signallingChannel = signallingChannel;
    this.signallingChannel.addEventListener("fromCaller", (event) =>
      this.dispatchEvent(new PayloadEvent("fromCaller", event.data))
    );
  }

  reciever(data) {
    this.signallingChannel.reciever(data);
  }
}

export default RecieverSignaller;
