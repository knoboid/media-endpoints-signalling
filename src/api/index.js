import ReceiverEndpoint from "./components/receiver-endpoint.js";
import TransmitterEndpoint from "./components/transmitter-endpoint.js";
import SimpleReceiverEndpoint from "./components/simple-receiver-endpoint.js";
import SimpleTransmitterEndpoint from "./components/simple-transmitter-endpoint.js";
import SimpleEndpoint from "./components/simple-endpoint.js";
import InfiniteEndpoints from "./components/infinite-endpoints.js";
import DataTable from "./components/data-table.js";
import SimpleDataTable from "./components/simple-data-table.js";

let url = null;

function initializeUrl() {
  console.log(url);
  if (url === null) {
    url = window.location.host;
  }
}

export function defineCustomElements() {
  initializeUrl();
  customElements.define("receiver-endpoint", ReceiverEndpoint);
  customElements.define("transmitter-endpoint", TransmitterEndpoint);
  customElements.define("simple-receiver-endpoint", SimpleReceiverEndpoint);
  customElements.define(
    "simple-transmitter-endpoint",
    SimpleTransmitterEndpoint
  );
  customElements.define("simple-endpoint", SimpleEndpoint);
  customElements.define("infinite-endpoints", InfiniteEndpoints);
  customElements.define("data-table", DataTable);
  customElements.define("simple-data-table", SimpleDataTable);
}

export const setup = defineCustomElements;
