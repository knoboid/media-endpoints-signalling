import { createTransmitter } from "../../create-transmitter.js";

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
      onGotUserID: (e) => {
        this.id = e.data;
        this.uiSignaller.resolve("onGotUserID", this.id);
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
