function addCellBorder(cell) {
  cell.style.border = "1px solid #999";
  cell.style.padding = "0.25rem 0.75rem";
}

class DataTable extends HTMLElement {
  constructor(endpointData) {
    super();
    this.innerHTML = "";
    this.rs = endpointData.receivers;
    this.ts = endpointData.transmitters;
    this.cs = endpointData.connections;
    this.addTableHeader();
    this.addTableRows();
  }

  addTableHeader() {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    addCellBorder(th);
    tr.appendChild(th);
    addCellBorder(tr);
    this.rs.forEach((r) => {
      const cell = document.createElement("th");
      addCellBorder(cell);
      cell.innerHTML = `${r.id}`;
      cell.style.color = r.status === "available" ? "black" : "grey";
      tr.appendChild(cell);
    });
    this.appendChild(tr);
  }

  addTableRows() {
    this.ts.forEach((t) => {
      const tr = document.createElement("tr");
      this.addTableRow(tr, t);
      this.appendChild(tr);
    });
  }

  addTableRow(tr, t) {
    const th = document.createElement("th");
    addCellBorder(th);
    th.style.color = t.status === "available" ? "black" : "grey";
    th.innerHTML = `${t.id}`;
    tr.appendChild(th);
    this.rs.forEach((r) => {
      const cell = document.createElement("td");
      addCellBorder(cell);
      cell.style.backgroundColor = this.isConnected(t.id, r.id)
        ? "grey"
        : undefined;
      cell.style.textAlign = "center";
      cell.style.verticalAlign = "middle";
      tr.appendChild(cell);
    });
  }

  isConnected(tid, rid) {
    for (const connection of this.cs) {
      if (tid == connection.transmitterID && rid == connection.receiverID)
        return true;
    }
    return false;
  }
}

export default DataTable;
