import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "../../Icon";

export default function CanjeoPuntos() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [200, 500, 1000];

  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Cliente",
      field: "cliente",
      width: 350,
    },
    {
      headerName: "Fecha de canjeo",
      field: "fecha_canjeo",
      width: 400,
    },
    {
      headerName: "ID cliente",
      field: "id_cliente",
      width: 250,
    },
    {
      headerName: "ID configuración puntos",
      field: "id_configuracion_puntos",
    },
    {
      headerName: "ID renta",
      field: "id_renta",
    },
    {
      headerName: "Puntos canjeados",
      field: "puntosCanjeados",
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/pointsMethod/all")
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="canjeo_puntos_cont">
      <h1>Canjeo de puntos</h1>

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
