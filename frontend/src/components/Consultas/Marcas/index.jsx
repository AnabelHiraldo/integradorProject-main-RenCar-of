import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Marcas() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50, 100];

  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState(""); 

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID Marca",
      field: "id_marca",
      width: 350,
    },
    {
      headerName: "Marca",
      field: "marca",
      width: 380,
    },
    {
      headerName: "Descripción",
      field: "descripcion",
      width: 350,
    },
    {
      headerName: "Estado",
      field: "estado",
      width: 380,
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/brand/getBrandAll") 
      .then((res) => {
        setRowData(res.data);
        setFilteredData(res.data); 
      })
      .catch((err) => {
        console.error("Error al obtener los datos:", err);
      });
  }, []);

  const handleSearch = () => {
    if (searchValue === "") {
      setFilteredData(rowData);
    } else {
      const filtered = rowData.filter((item) =>
        item.marca.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered); 
    }
  };

  return (
    <div className="marca_cont">
      <h1>Marcas</h1>

      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por Marca..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>
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
