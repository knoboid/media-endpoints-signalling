import { createAdminWSSignaller } from "./signalling/network/create-ws-signallers.js";

const testButton = document.querySelector("#test-button");

export function adminSetup(switchboard) {
  let authenticated = false;
  const adminSignaller = createAdminWSSignaller();

  adminSignaller.addEventListener("password", () => {
    adminSignaller.send({ type: "secret", payload: "123456" });
  });

  adminSignaller.addEventListener("authenticated", (x) => {
    authenticated = x.data;
    if (authenticated) {
      console.log("Successfully Authenticated");
      adminSignaller.send({ type: "sendData" });
    }
  });

  adminSignaller.addEventListener("updateUsers", (e) => {
    switchboard.updateUsers(e.data);
  });

  switchboard.addEventListener("click", (e) => {
    const elementType = e.target["data-type"];
    if (elementType === "from") {
      switchboard.renderCallFrom(e.target["data-user"]);
      // switchboard.renderCallFrom(e.target["innerText"]);
    } else if (elementType === "to") {
      switchboard.renderCallTo(e.target["data-user"]);
      // switchboard.renderCallTo(e.target["innerText"]);
    } else if (elementType === "call-button") {
      //
      if (switchboard.canCall()) {
        console.log("Place call");
        adminSignaller.send({
          type: "newCall",
          payload: switchboard.callData(),
        });
      }
    }
  });
}
