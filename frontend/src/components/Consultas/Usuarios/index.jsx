import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Usuarios() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50, 100];

  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [searchEmail, setSearchEmail] = useState(""); 
  const [searchRole, setSearchRole] = useState(""); 
  const [filterOption, setFilterOption] = useState("email"); 

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID Usuario",
      field: "id_usuario",
      width: 150,
    },
    {
      headerName: "Email",
      field: "email",
      width: 200,
    },
    {
      headerName: "Username",
      field: "username",
      width: 200,
    },
    {
      headerName: "Contraseña",
      field: "contraseña",
      width: 200,
    },
    {
      headerName: "Fecha de Sesión",
      field: "fecha_session",
      width: 200,
    },
    {
      headerName: "Sesión Activa",
      field: "sesion",
      width: 180,
    },
    {
      headerName: "Nombre Rol",
      field: "rol_nombre",
      width: 250,
    },
  ]);

 
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user") 
      .then((res) => {
        setRowData(res.data); 
        setFilteredData(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener los datos:", err);
      });
  }, []);

  const handleSearch = () => {
    let filtered = rowData;

    if (filterOption === "email" && searchEmail) {
      
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    } else if (filterOption === "role" && searchRole) {
    
      filtered = filtered.filter((user) =>
        user.rol_nombre.toLowerCase().includes(searchRole.toLowerCase())
      );
    }

    setFilteredData(filtered); 
  };

  return (
    <div className="usuarios_cont">
      <h1>Usuarios</h1>


      <div className="search-container">
        <div className="search-group">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="filter-dropdown"
          >
            <option value="email">Buscar por Correo</option>
            <option value="role">Buscar por Rol</option>
          </select>
        </div>

        <div className="search-group">
          {filterOption === "email" ? (
            <input
              type="text"
              placeholder="Buscar por Correo"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="search-input"
            />
          ) : (
            <input
              type="text"
              placeholder="Buscar por Rol"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
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
          height: "70vh",
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
