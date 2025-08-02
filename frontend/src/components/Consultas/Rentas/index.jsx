import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "../../Icon";

export default function Rentas() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [200, 500, 1000];

  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID",
      field: "id_renta",
      width: 275,
    },
    {
      headerName: "Nombre del cliente",
      field: "cliente",
      width: 350,
    },
    {
      headerName: "Subtotal",
      field: "subTotal",
      width: 350,
    },
    {
      headerName: "Total",
      field: "total",
      width: 350,
    },
    {
      headerName: "Condición",
      field: "nombre_condicion",
      width: 275,
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/rent/rents/getCustomAll")
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="rentas_cont">
      <h1>Rentas</h1>

      <div
        className="ag-theme-quartz"
        style={{
          height: "50vh",
        }}
      >
        <AgGridReact
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          rowData={rowData}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
}
