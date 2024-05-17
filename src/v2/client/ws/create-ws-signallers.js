// import TransmitterSignaller from "./transmitter-signaller.js";
import ReceiverSignaller from "./receiver-signaller.js";

const wss = "wss://192.168.0.72:5502";

// export function createTransmitterWSSignaller(code) {
//   return new TransmitterSignaller(wss);
// }

export function createReceiverWSSignaller(code) {
  return new ReceiverSignaller(wss);
}
