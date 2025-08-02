import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "../../Icon";

export default function AnulacionPuntos() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [200, 500, 1000];

  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID cliente",
      field: "id_cliente",
      width: 250,
    },
    {
      headerName: "ID renta",
      field: "id_renta",
      width: 300,
    },
    {
      headerName: "Cliente",
      field: "cliente",
      width: 350,
    },
    {
      headerName: "Puntos anulados",
      field: "puntos_anulados",
      width: 350,
    },
    {
      headerName: "Fecha de anulación",
      field: "fecha_anulacion",
      width: 350,
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/anularPuntos")
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="anulacion_puntos_cont">
      <h1>Anulación de puntos</h1>

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
