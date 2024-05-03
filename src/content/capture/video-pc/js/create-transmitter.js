import { setupTransmitter } from "./media-transmitter.js";

// Shoiuld it be createUserMediaTransmitter

export function createTransmitter(servers, constraints, ui, code) {
  function setup(stream) {
    const transmitterController = setupTransmitter(servers, stream, ui, code);
    console.log("createTransmitter - got transmitterController");
    console.log(transmitterController);
    return new Promise((resolve, reject) => resolve(transmitterController));
  }
  return navigator.mediaDevices.getUserMedia(constraints).then(setup); //.catch(handleError);
}
