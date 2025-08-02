import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "../../Icon";

export default function Clientes() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [200, 500, 1000];

  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Nombre",
      field: "nombre",
      width: 150,
    },
    {
      headerName: "Apellido",
      field: "apellido",
      width: 150,
    },
    {
      headerName: "Fecha de nacimiento",
      field: "fechaNacimiento",
    },
    {
      headerName: "Email",
      field: "email",
    },
    {
      headerName: "Número de documento",
      field: "documentoIdentidad",
    },
    {
      headerName: "Tipo de documento",
      field: "documento",
    },
    {
      headerName: "Fecha de ingreso",
      field: "fecha_ingreso",
    },
    {
      headerName: "Total de rentas",
      field: "total_rentas",
    },
    {
      headerName: "Sexo",
      field: "sexo",
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/clients/all")
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="clientes_cont">
      <h1>Clientes</h1>

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
