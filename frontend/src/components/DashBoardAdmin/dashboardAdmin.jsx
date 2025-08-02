import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

//Falta dinamizar el dashboad

import "./styleDashboardAdmin.css";
export default function DashboardAdmin() {
  const [isEditing, setisEditing] = useState(false);
  const [searchAccesory, setsearchAccesory] = useState("");
  const [miEmpresa, setMiEmpresa] = useState([]);
  const [clientActive, setClientActive] = useState([]);
  const [reservaPendiente, setReservaPendiente] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [reservasRecientes, setReservasRecientes] = useState([]);
  const [ingresoMensual, setIngresoMensual] = useState([]);


  const handleSubmit = (values) => {
    const url = `http://localhost:3000/api/${
      !isEditing ? "accesory" : `accesory/${searchAccesory}`
    }`;
    const method = !isEditing ? "post" : "put";

    axios[method](url, values)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  function searcAccesory(setFormikValues) {
    axios
      .get(`http://localhost:3000/api/accesory/${searchAccesory}`)
      .then((response) => {
        setFormikValues({
          ...response.data,
          fecha: response.data.fecha.split("T")[0],
          id_estado_a_i: 1,
        });
        console.log("response", response.data);
        setisEditing(true);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se encontro el accesorio",
        });
      });
  }
  useEffect(() => {
    axios.get("http://localhost:3000/api/myCompany").then((response) => {
      setMiEmpresa(response.data[0]);
      // console.log(response.data);
    });
    axios.get("http://localhost:3000/api/dashboard").then((response) => {
      setClientActive(response.data.clientes_activos);
      setReservaPendiente(response.data.reservas_pendientes);
      setVehiculosDisponibles(response.data.vehiculos_disponibles);
    });
    axios
      .get("http://localhost:3000/api/dashboard/reservasRecientes")
      .then((response) => {
        setReservasRecientes(response.data);
      });

      axios
      .get("http://localhost:3000/api/dashboard/get/ingresosMensual")
      .then((response) => {
        setIngresoMensual(response.data.total_ingresos_mensuales);
      });



      
  }, []);
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Panel de Administración -{miEmpresa.nombre}{" "}
      </h1>

      <div className="dashboard-stats" onClick={handleSubmit}>
        <div className="stat-card">
          <h2>Vehículos Disponibles</h2>
          <p>{vehiculosDisponibles} </p>
        </div>
        <div className="stat-card">
          <h2>Reservas Pendientes</h2>
          <p>{reservaPendiente} </p>
        </div>
        <div className="stat-card">
          <h2>Clientes Activos</h2>
          <p>{clientActive} </p>
        </div>
        <div className="stat-card">
          <h2>Ingresos del Mes</h2>
          <p>${ingresoMensual} </p>
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="table-section">
          <h2>Reservas Recientes</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Fecha Inicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasRecientes.length > 0 ? (
                reservasRecientes.map((reserva) => (
                  <tr key={reserva.ID}>
                    <td>#{reserva.ID}</td>
                    <td>{reserva.Cliente}</td>
                    <td>{reserva.Vehiculo}</td>
                    <td>{reserva.FechaInicio}</td>
                    <td>{reserva.Estado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay reservas recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h2>Vehículos en Mantenimiento</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Estado</th>
                <th>Fecha Estimada</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#003</td>
                <td>Toyota Hilux</td>
                <td>En Reparación</td>
                <td>2024-12-22</td>
              </tr>
              <tr>
                <td>#004</td>
                <td>Kia Sportage</td>
                <td>Inspección</td>
                <td>2024-12-19</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
