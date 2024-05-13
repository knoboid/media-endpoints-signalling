import ReceiverEndpoint from "./api/components/receiver-endpoint.js";
import Receiver from "./client/js/media-reciever.js";

customElements.define("reciever-endpoint", ReceiverEndpoint);
const recieverElement = document.querySelector("reciever-endpoint");
const video = recieverElement.videoElement;
new Receiver(null, video, null, onReceiverReady, null);

function onReceiverReady(receiverId) {
  recieverElement.setId(receiverId);
}
