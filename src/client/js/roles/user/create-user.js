import User from "./user.js";
import { createUserWSSignaller } from "../../signalling/network/create-ws-signallers.js";

const userComponent = document.querySelector("#media-user");

function createUser(servers, constraints) {
  const user = new User(
    servers,
    constraints,
    createUserWSSignaller(),
    userComponent
  );
}

export default createUser;
