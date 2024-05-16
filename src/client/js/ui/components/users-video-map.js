class UsersVideoMap {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.map = {};
  }

  addReceiver(userId) {
    const container = document.createElement("div");
    container.innerHTML = `<div><span>User: ${userId}<span><button>hangup</button></div>`;
    container.innerHTML = `<div><span>User: ${userId}<span></div>`;
    const video = document.createElement("video");
    video.setAttribute("style", "width: 200px");
    video.setAttribute("playsinline", true);
    video.setAttribute("autoplay", true);
    video.setAttribute("controls", true);
    video.volume = 0;
    container.appendChild(video);
    this.parentElement.appendChild(container);
    // const button = container.querySelector("button");
    // button.onclick = () => {
    //   console.log(userId);
    //   this.removeVideoElement(userId);
    // };

    this.map[userId] = container;
    return video;
  }

  getVideoElement(userId) {
    return this.map[userId];
  }

  removeVideoElement(userId) {
    this.parentElement.removeChild(this.getVideoElement(userId));
    delete this.map[userId];
  }

  idExists(userId) {
    return Object.keys(this.map).includes(userId);
  }
}

export default UsersVideoMap;
