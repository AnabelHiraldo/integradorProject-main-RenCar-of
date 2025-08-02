

import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Vehiculos() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 200, 500, 1000];

  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("placa");

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID Vehículo", field: "id_vehiculo", width: 150 },
    { headerName: "Matrícula", field: "matricula", width: 150 },
    { headerName: "Número Chasis", field: "numChasis", width: 150 },
    { headerName: "Placa", field: "placa", width: 150 },
    { headerName: "Año", field: "año", width: 100 },
    { headerName: "Número de Puertas", field: "numPuertas", width: 150 },
    { headerName: "Capacidad de Personas", field: "capacidadPersonas", width: 200 },
    { headerName: "Kilometraje Actual", field: "kilometraje_actual", width: 200 },
    { headerName: "Capacidad de Combustible", field: "capacidad_combustible", width: 200 },
    { headerName: "Capacidad de Carga (Peso)", field: "capacidad_carga_peso", width: 200 },
    { headerName: "Precio", field: "precio", width: 150 },
    { headerName: "Imagen", field: "imagen_url", width: 250, cellRenderer: (params) => (
        <img src={params.value} alt="Vehículo" style={{ width: "100px", height: "auto" }} />
      ) 
    },
    { headerName: "Categoría", field: "categoria", width: 150 },
    { headerName: "Marca", field: "marca", width: 150 },
    { headerName: "Modelo", field: "modelo", width: 150 },
    { headerName: "Versión", field: "veersion", width: 150 },
    { headerName: "Color", field: "color", width: 150 },
    { headerName: "Condición", field: "id_condicion", width: 150 },
    { headerName: "Sistema de Freno", field: "sistema_freno", width: 200 },
    { headerName: "Tracción", field: "traccion", width: 150 },
    { headerName: "Tipo de Propulsión", field: "tipo_propulsion", width: 200 },
    { headerName: "Tipo de Transmisión", field: "tipo_transmision", width: 200 },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/vehicle")
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

    if (searchValue) {
      filtered = filtered.filter((vehicle) => {
        if (searchType === "placa") {
          return vehicle.placa.toLowerCase().includes(searchValue.toLowerCase());
        } else if (searchType === "marca") {
          return vehicle.marca.toLowerCase().includes(searchValue.toLowerCase());
        } else if (searchType === "anio") {
          return vehicle.año.toString().includes(searchValue);
        }
        return true;
      });
    }

    setFilteredData(filtered);
  };

  return (
    <div className="vehiculos_cont">
      <h1>Vehículos</h1>

      {/* Buscadores con estilo */}
      <div className="search-fields">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)} 
          className="search-select"
        >
          <option value="placa">Placa</option>
          <option value="marca">Marca</option>
          <option value="anio">Año</option>
        </select>

        <button onClick={handleSearch} className="search-button">Buscar</button>
      </div>

      <div className="ag-theme-quartz" style={{ height: "50vh" }}>
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
