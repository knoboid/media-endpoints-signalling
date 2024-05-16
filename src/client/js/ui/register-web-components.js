import ReceiversList from "./components/receivers-list.js";
import ReceiverRow from "./components/receiver-row.js";
import MediaUser from "./components/media-user.js";
import SwitchboardComponent from "./components/switchboard-component.js";
import EndpointsTable from "./components/endpoints-table.js";
import NameEntry from "./components/name-entry.js";

export default function registerWebComponents() {
  customElements.define("receivers-list", ReceiversList);
  customElements.define("receiver-row", ReceiverRow);
  customElements.define("media-user", MediaUser);
  customElements.define("switchboard-component", SwitchboardComponent);
  customElements.define("endpoints-table", EndpointsTable);
  customElements.define("name-entry", NameEntry);
}
