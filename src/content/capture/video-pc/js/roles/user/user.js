import { createRecieverConnection } from "../../connections/reciever-connection.js";
import { createTransmitter } from "../../create-transmitter.js";
import { setupReciever } from "../../media-reciever.js";
import PayloadEvent from "../../payload-event.js";

class User {
  constructor(servers, constraints, wsSignaller, uiSignaller) {
    this.servers = servers;
    this.transmitterController = null;
    this.constraints = constraints;
    this.wsSignaller = wsSignaller;
    this.uiSignaller = uiSignaller;
    this.registerWSListeners();
    this.registerUIListeners();
  }

  defineWSListeners() {
    return {
      getUserID: (e) => {
        this.id = e.data;
        this.uiSignaller.resolve("getUserID", this.id);
      },
      transmitterRegistrationCode: (e) => {
        const code = e.data;
        console.log("transmitterRegistrationCode");
        if (this.transmitterController === null) {
          createTransmitter(
            this.servers,
            this.constraints,
            this.uiSignaller,
            code
          ).then((tc) => {
            console.log("got transmitter controller");
            console.log(tc);
            this.transmitterController = tc;
          });
        }
        console.log(this.transmitterController);
      },
      updateUsers: (e) => {
        this.uiSignaller.resolve("updateUsers", e.data);
      },
      requestReciever: (e) => {
        console.log(`request reciever for call with user ${e.data}`);
        const userId = e.data.userId;
        const videoElement = this.uiSignaller.resolve(
          "addRecieverVideo",
          e.data.userId
        );
        if (typeof videoElement !== "undefined") {
          const onready = (recieverId) => {
            this.wsSignaller.send({
              type: "recieverReady",
              payload: { recieverId, userId },
            });
          };
          const onhangup = () => {
            console.log("hangup signal callback!");
          };
          setupReciever(
            this.servers,
            videoElement,
            e.data.code,
            onready,
            onhangup
          );
        } else {
          console.log("Reciever video not created!");
        }
      },
      recieverRegistrationCode: (e) => {
        console.log("recieverRegistrationCode", e.data);
      },
      userReady: (e) => {
        console.log("userReady");
        console.log(e);
        console.log(e.data.recieverId);
        // this.transmitterController.call(e.data.recieverId)
        this.transmitterController.signaller.send({
          type: "initiateCall",
          payload: { recieverID: e.data.recieverId },
        });
      },
    };
  }

  defineUIListeners() {
    return {
      START: (e) => {
        console.log("Start App!");
        this.wsSignaller.send({ type: "requestTransmitter" });
      },
      STOP: (e) => {
        console.log("Stop App!");
        // this.wsSignaller.send({ type: "removeTransmitter" });
        console.log(this.transmitterController);
        if (this.transmitterController) {
          // This is wrong. Don't need to do hangup. Just need to stopstream.
          // this.transmitterController.hangup();
          //this.transmitterSignaller.send()
        }
      },
      CALL: (e) => {
        console.log(e);
        if (this.transmitterController) {
          this.wsSignaller.send({
            type: "initiateCallToUser",
            payload: e.data,
          });
          // this.transmitterController.initiateUserCall(e.data);
        }
      },
    };
  }

  registerWSListeners() {
    const listenerDefs = this.defineWSListeners();
    Object.entries(listenerDefs).forEach(([eventName, callback]) =>
      this.wsSignaller.addEventListener(eventName, callback)
    );
  }

  registerUIListeners() {
    const listenerDefs = this.defineUIListeners();
    Object.entries(listenerDefs).forEach(([eventName, callback]) =>
      this.uiSignaller.addEventListener(eventName, callback)
    );
  }
}

export default User;
