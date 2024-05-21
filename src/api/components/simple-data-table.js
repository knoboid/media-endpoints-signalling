import DataTable from "./data-table.js";
import DataViewer from "../../v2/client/data-viewer.js";

class SimpleDataTable extends HTMLElement {
  constructor() {
    super();
    this.dataViewer = new DataViewer();

    this.dataViewer.addEventListener("endpointData", (event) => {
      console.log("SimpleDataTable");
      console.log(event.data);
      this.innerHTML = "";
      this.appendChild(new DataTable(event.data));
    });
  }
}

export default SimpleDataTable;
