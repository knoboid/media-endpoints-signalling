class ReceiverEndpoint extends HTMLElement {
  constructor() {
    super();
    this.idElement = document.createElement("div");
    this.setId();
    this.videoElement = document.createElement("video");
    this.videoElement.setAttribute("style", "width: 200px");
    this.videoElement.setAttribute("playsinline", true);
    this.videoElement.setAttribute("autoplay", true);
    this.videoElement.setAttribute("controls", true);
    this.videoElement.volume = 0;
    this.appendChild(this.idElement);
    this.appendChild(this.videoElement);
  }

  setId(id) {
    const renderedId = isNaN(id) ? "?" : id;
    this.idElement.innerHTML = `Receiver ID: ${renderedId}`;
  }
}

export default ReceiverEndpoint;
