const recieversContainder = document.querySelector("#recievers-container");
// reciever
const rightVideo = document.getElementById("rightVideo");
const recieverIDElement = document.querySelector("#reciever-id");
const recieverHangupButton = document.querySelector("#reciever-hangup");
// right video
export function setRecieverID(recieverID) {
  recieverIDElement.innerHTML = recieverID;
}

export function addRecieverElement() {
  const video = document.createElement("video");
  video.setAttribute("style", "width: 200px");
  video.setAttribute("playsinline", true);
  video.setAttribute("autoplay", true);
  video.setAttribute("controls", true);
  video.volume = 0;
  recieversContainder.appendChild(video);
  return video;
}

rightVideo.onloadedmetadata = () => {
  console.log(
    `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
  );
};

export class RecieverUI {
  constructor() {
    this.videoElement = document.createElement("video");
    video.setAttribute("style", "width: 200px");
    video.setAttribute("playsinline", true);
    video.setAttribute("autoplay", true);
    video.setAttribute("controls", true);
    video.volume = 0;
    recieversContainder.appendChild(video);
  }

  set id(id) {
    this._id = id;
  }
}

export class RecieverUIEvents extends EventTarget {
  constructor() {
    super();
    this.recieverHangupButton = recieverHangupButton;

    this.recieverHangupButton.onclick = () => {
      this.dispatchEvent(new Event("reciever-hangup"));
    };
  }
}

export const recieverUIEvents = new RecieverUIEvents(recieverHangupButton);
