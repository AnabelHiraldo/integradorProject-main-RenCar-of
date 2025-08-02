import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Empleados() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 200, 500, 1000];

  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 

  const [searchDocument, setSearchDocument] = useState(""); 
  const [searchPosition, setSearchPosition] = useState("");
  const [filterOption, setFilterOption] = useState("documento"); 

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID",
      field: "id_empleado",
      width: 100, 
    },
    {
      headerName: "Fecha de ingreso",
      field: "fechaIngresoEmpleado",
      width: 200,
    },
    {
      headerName: "Estado Empleado",
      field: "estadoEmpleado",
      width: 180,
    },
    {
      headerName: "Nombre",
      field: "nombre",
      width: 180, 
    },
    {
      headerName: "Apellido",
      field: "apellido",
      width: 180, 
    },
    {
      headerName: "Fecha Nacimiento",
      field: "fechaNacimiento",
      width: 200,
    },
    {
      headerName: "Email",
      field: "email",
      width: 250,
    },
    {
      headerName: "Documento de Identidad",
      field: "documentoIdentidad",
    },
    {
      headerName: "Tipo de Entidad",
      field: "nombreTipoEntidad",
      width: 200,
    },
    {
      headerName: "Sexo",
      field: "sexoNombre",
      width: 150,
    },
    {
      headerName: "Posición",
      field: "nombrePosicion",
      width: 180,
    },
    {
      headerName: "Salario",
      field: "salario",
      width: 150,
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/employee")
      .then((res) => {
        setRowData(res.data);
        setFilteredData(res.data); 
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = () => {
    let filtered = rowData;

    if (filterOption === "documento" && searchDocument) {
      filtered = filtered.filter((employee) =>
        employee.documentoIdentidad.toLowerCase().includes(searchDocument.toLowerCase())
      );
    } else if (filterOption === "position" && searchPosition) {
      filtered = filtered.filter((employee) =>
        employee.nombrePosicion.toLowerCase().includes(searchPosition.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  return (
    <div className="Empleados_cont">
      <h1>Empleados</h1>

      <div className="search-container">
        <div className="search-group">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="filter-dropdown"
          >
            <option value="documento">Buscar por Documento de Identidad</option>
            <option value="position">Buscar por Posición</option>
          </select>
        </div>

        <div className="search-group">
          {filterOption === "documento" ? (
            <input
              type="text"
              placeholder="Buscar por Documento de Identidad"
              value={searchDocument}
              onChange={(e) => setSearchDocument(e.target.value)}
              className="search-input"
            />
          ) : (
            <input
              type="text"
              placeholder="Buscar por Posición"
              value={searchPosition}
              onChange={(e) => setSearchPosition(e.target.value)}
              className="search-input"
            />
          )}
        </div>

        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>
      </div>

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
          rowData={filteredData} 
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
}
