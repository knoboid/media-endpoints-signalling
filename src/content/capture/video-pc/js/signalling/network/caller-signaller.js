// import PayloadEvent from "../../payload-event.js";

class CallerSignaller extends EventTarget {
  constructor(url) {
    super();
    this.socket = new WebSocket(url);
    const counter = 0;

    this.socket.onopen = (e) => {
      console.log("SOCKET OPENED");
    };

    this.socket.onmessage = (message) => {
      switch (counter) {
        case 0:
          const id = Number(message.data);
          if (isNaN(id)) throw new TypeError("Expect a number");
          console.log(`Setting id to ${id}`);
          this.id = id;
          this.socket.send(id);
          break;

        default:
          break;
      }
    };
    // this.signallingChannel = signallingChannel;
    // this.signallingChannel.addEventListener("fromResponder", (event) =>
    //   this.dispatchEvent(new PayloadEvent("fromResponder", event.data))
    // );
  }

  caller(data) {
    // this.signallingChannel.caller(data);
  }
}

export default CallerSignaller;
