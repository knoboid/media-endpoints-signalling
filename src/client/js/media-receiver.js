import { createRecieverConnection } from "./connections/receiver-connection.js";
import { createRecieverWSSignaller } from "./signalling/network/create-ws-signallers.js";

class Receiver {
  constructor(servers, videoElement, code, onready, onhangup) {
    this.servers = servers;
    this.onhangup = onhangup;
    const p2 = "p2";
    this.pc;

    this.nWRecieverSignaller = createRecieverWSSignaller(code);

    this.nWRecieverSignaller.addEventListener("receiverRegistered", (e) => {
      const receiverID = e.data;
      console.log("before onready");
      console.log(e);
      console.log(receiverID);
      // setRecieverID(receiverID);
      onready(receiverID);
    });

    this.nWRecieverSignaller.addEventListener("newConnectionRequest", () => {
      this.receive(videoElement);
    });

    this.nWRecieverSignaller.addEventListener("terminated", (e) => {
      console.log("Reciever terminating");
      console.log(e);
      this.pc.close();
    });

    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    };
  }

  receive(videoElement) {
    console.log("Recieve");
    this.pc = createRecieverConnection(
      this.servers,
      this.p2,
      this.nWRecieverSignaller,
      videoElement
    );
  }
}

export default Receiver;
