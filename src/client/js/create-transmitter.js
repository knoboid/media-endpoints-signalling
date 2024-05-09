import Transmitter from "./media-transmitter.js";

// Shoiuld it be createUserMediaTransmitter

export function createTransmitter(servers, constraints, code) {
  function setup(stream) {
    const transmitter = new Transmitter(servers, stream, code);
    return new Promise((resolve, reject) => resolve(transmitter));
  }
  return navigator.mediaDevices.getUserMedia(constraints).then(setup); //.catch(handleError);
}