import RecieversList from "./components/recievers-list.js";
import ReciverRow from "./components/reciever-row.js";
import MediaUser from "./components/media-user.js";
import SwitchboardComponent from "./components/switchboard-component.js";
import EndpointsTable from "./components/endpoints-table.js";
import NameEntry from "./components/name-entry.js";

export default function registerWebComponents() {
  customElements.define("recievers-list", RecieversList);
  customElements.define("reciever-row", ReciverRow);
  customElements.define("media-user", MediaUser);
  customElements.define("switchboard-component", SwitchboardComponent);
  customElements.define("endpoints-table", EndpointsTable);
  customElements.define("name-entry", NameEntry);
}
