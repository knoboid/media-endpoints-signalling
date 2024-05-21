import { createDataViewerSignaller } from "./ws/create-ws-signallers.js";
import PayloadEvent from "./misc/payload-event.js";

class DataViewer extends EventTarget {
  constructor() {
    super();

    this.nWDataViewerSignaller = createDataViewerSignaller();

    this.nWDataViewerSignaller.addEventListener("endpointData", (event) => {
      this.dispatch("endpointData", event.data.payload);
    });
  }

  dispatch(type, payload) {
    this.dispatchEvent(new PayloadEvent(type, payload));
  }
}

export default DataViewer;
