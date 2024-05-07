import Transmitter from "./media-transmitter.js";

// Shoiuld it be createUserMediaTransmitter

export function createTransmitter(servers, constraints, ui, code) {
  function setup(stream) {
    const transmitter = new Transmitter(servers, stream, ui, code);
    return new Promise((resolve, reject) => resolve(transmitter));
  }
  return navigator.mediaDevices.getUserMedia(constraints).then(setup); //.catch(handleError);
}
