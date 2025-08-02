import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PayPropietario() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 200, 500, 1000];

  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Campos de búsqueda
  const [searchPlaca, setSearchPlaca] = useState("");
  const [searchModelo, setSearchModelo] = useState("");
  
  // Opción del filtro
  const [filterOption, setFilterOption] = useState("modelo"); 

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID Renta",
      field: "id_renta",
      width: 120,
    },
    {
      headerName: "Modelo",
      field: "modelo",
      width: 180,
    },
    {
      headerName: "Placa",
      field: "placa",
      width: 150,
    },
    {
      headerName: "Propietario",
      valueGetter: (params) => {
        const nombre = params.data.nombre || "";
        const apellido = params.data.apellido || "";
        return `${nombre} ${apellido}`.trim();
      },
      width: 200,
    },
    {
      headerName: "Tipo de Acuerdo",
      field: "tipo_de_acuerdo",
      width: 180,
    },
    {
      headerName: "Valor Comisión Tarifa",
      field: "valor_comision_tarifa",
      width: 200,
    },
    {
      headerName: "Monto Renta",
      field: "monto_renta",
      width: 150,
    },
    {
      headerName: "Monto a Pagar",
      field: "pagar_propietario",
      width: 180,
    },
  ]);
  

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/propietario/get/getPayPropietario")
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

    if (filterOption === "modelo" && searchModelo) {
      filtered = filtered.filter((item) =>
        item.modelo.toLowerCase().includes(searchModelo.toLowerCase())
      );
    } else if (filterOption === "placa" && searchPlaca) {
      filtered = filtered.filter((item) =>
        item.placa.toLowerCase().includes(searchPlaca.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  return (
    <div className="RentaPropietario_cont">
      <h1>Registro Renta Propietario</h1>

      <div className="search-container">
        <div className="search-group">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="filter-dropdown"
          >
            <option value="modelo">Buscar por Modelo</option>
            <option value="placa">Buscar por Placa</option>
          </select>
        </div>

        <div className="search-group">
          {filterOption === "modelo" ? (
            <input
              type="text"
              placeholder="Buscar por Modelo"
              value={searchModelo}
              onChange={(e) => setSearchModelo(e.target.value)}
              className="search-input"
            />
          ) : (
            <input
              type="text"
              placeholder="Buscar por Placa"
              value={searchPlaca}
              onChange={(e) => setSearchPlaca(e.target.value)}
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
