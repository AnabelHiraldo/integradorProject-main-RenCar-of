import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "../../Icon";

export default function RegistroPuntos() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [200, 500, 1000];

  const [rowData, setRowData] = useState([]); //[]

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID",
      field: "id_cliente",
      width: 300,
    },
    {
      headerName: "Cliente",
      field: "cliente",
      width: 400,
    },
    {
      headerName: "ID renta",
      field: "id_renta",
    },
    {
      headerName: "Puntos obtenidos",
      field: "puntosObtenidos",
    },
    {
      headerName: "Fecha de registro",
      field: "fecha_registro",
      width: 300,
    },
    {
      headerName: "ID configuración de puntos",
      field: "id_configuracion_puntos",
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/registroPuntos/all")
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="registroPuntos_cont">
      <h1>Registro de puntos</h1>

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
