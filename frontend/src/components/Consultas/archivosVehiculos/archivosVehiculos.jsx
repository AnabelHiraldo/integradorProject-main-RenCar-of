import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import Select from "react-select";
import "./archivosVehiculos.css"; 

export default function ArchivosVehiculos() {
  const [rowData, setRowData] = useState([]);
  const [placa, setPlaca] = useState("");
  const [idTipoArchivo, setIdTipoArchivo] = useState(null);
  const [tipoArchivo, setTipoArchivo] = useState([]);

  const [columnDefs] = useState([
    { headerName: "ID Vehículo", field: "id_vehiculo", width: 120 },
    { headerName: "Placa", field: "placa", width: 120 },
    { headerName: "Tipo de Archivo", field: "tipo_archivo", width: 200 },
    { headerName: "Número Archivo", field: "num_archivo", width: 120 },
    { headerName: "Nombre Archivo", field: "nombre_archivo", width: 200 },
    {
      headerName: "Archivo",
      field: "ruta_archivo",
      width: 250,
      cellRenderer: (params) => {
        const filePath = params.value;
        if (!filePath) return "Sin archivo";

        const fileURL = `http://localhost:3000/${filePath.replace(/\\/g, "/")}`;

        if (filePath.endsWith(".pdf")) {
          return (
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              Ver Archivo PDF
            </a>
          );
        } else if (
          filePath.endsWith(".jpg") ||
          filePath.endsWith(".jpeg") ||
          filePath.endsWith(".png")
        ) {
          return (
            <a href={fileURL} target="_blank" rel="noopener noreferrer">
              <img
                src={fileURL}
                alt="Archivo Imagen"
                style={{ width: "100px", height: "auto", cursor: "pointer" }}
              />
            </a>
          );
        } else {
          return "Archivo no soportado";
        }
      },
    },
    { headerName: "Fecha Subida", field: "fecha_subida", width: 180 },
  ]);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/api/vehicle/plotica/get/vehicle/files/with", {
        params: { placa, id_tipo_archivo: idTipoArchivo },
      })
      .then((res) => setRowData(res.data))
      .catch((err) => console.error("Error al cargar datos:", err));
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/tipoArchivo").then((response) => {
      if (response.data) {
        setTipoArchivo(response.data);
      } else {
        setTipoArchivo([]);
      }
    });
    fetchData();
  }, []);

  return (
    <div className="archivosvehiculos-container">
      <h1>Archivos de Vehículos</h1>

      <div className="search-container">
        <div className="search-group">
          <input
            type="text"
            placeholder="Filtrar por placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="search-group">
          <Select
            options={tipoArchivo.map((item) => ({
              value: item.id_tipo_archivo,
              label: item.nombre,
            }))}
            isClearable
            isSearchable
            value={
              idTipoArchivo
                ? {
                    value: idTipoArchivo,
                    label:
                      tipoArchivo.find(
                        (item) => item.id_tipo_archivo === idTipoArchivo
                      )?.nombre || "",
                  }
                : null
            }
            onChange={(selectedOption) =>
              setIdTipoArchivo(selectedOption ? selectedOption.value : null)
            }
            placeholder="Selecciona un tipo de archivo"
            className="filter-dropdown"
          />
        </div>

        <div className="search-group">
          <button onClick={fetchData} className="search-button">
            Buscar
          </button>
        </div>
      </div>

      <div
        className="ag-theme-quartz"
        style={{ height: "50vh", width: "100%", marginTop: "20px" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
