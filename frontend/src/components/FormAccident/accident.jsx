import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import "./accident.css";

const FormAccident = () => {
  const [vehicle, setVehicle] = useState(null); 
  const [searchPlaca, setSearchPlaca] = useState(""); 
  const [employees, setEmployees] = useState([]); 

  useEffect(() => {
  
    axios
      .get("http://localhost:3000/api/employee")
      .then((res) => setEmployees(res.data))
      .catch((error) =>
        console.error("Error al cargar empleados:", error.message)
      );
  }, []);

  const handleSearchByPlaca = async () => {
    if (!searchPlaca.trim()) {
      Swal.fire("Error", "Ingrese un número de placa para buscar el vehículo", "error");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/api/vehicle/${searchPlaca}`);
      setVehicle(res.data); // Actualizar datos del vehículo
      Swal.fire("Éxito", "Vehículo encontrado", "success");
    } catch (error) {
      setVehicle(null);
      Swal.fire("Error", "No se encontró un vehículo con esa placa", "error");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const dataToSend = {
        ...values,
        placa: searchPlaca, 
      };

      await axios.post("http://localhost:3000/api/Accident", dataToSend);
      Swal.fire("Éxito", "Accidente registrado correctamente", "success");
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al registrar el accidente", "error");
    }
  };

  return (
    <section className="sectionAccident">
      <header>
        <h1>Registro de Accidentes</h1>
      </header>

      <div className="search-container">
        <label htmlFor="searchPlaca">Buscar Vehículo por Placa:</label>
        <div className="search-group">
          <input
            type="text"
            id="searchPlaca"
            placeholder="Ingrese número de placa"
            value={searchPlaca}
            onChange={(e) => setSearchPlaca(e.target.value)}
          />
          <button className="buttonSearch" onClick={handleSearchByPlaca}>
            Buscar
          </button>
        </div>
      </div>

      <Formik
        initialValues={{
          id_empleado: "",
          fecha_accidente: "",
          descripcion: "",
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="form-group">
              <div className="form-field">
                <label htmlFor="id_empleado">Responsable:</label>
                <Field as="select" id="id_empleado" name="id_empleado" className="form-control">
                  <option value="">Seleccionar Empleado</option>
                  {employees.map((emp) => (
                    <option key={emp.id_empleado} value={emp.id_empleado}>
                      {emp.nombre} {emp.apellido}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="id_empleado" component="p" className="error-message" />
              </div>

              <div className="form-field">
                <label htmlFor="fecha_accidente">Fecha del Accidente:</label>
                <Field type="datetime-local" id="fecha_accidente" name="fecha_accidente" className="form-control" />
                <ErrorMessage name="fecha_accidente" component="p" className="error-message" />
              </div>

              <div className="form-field">
                <label htmlFor="descripcion">Descripción del Accidente:</label>
                <Field as="textarea" id="descripcion" name="descripcion" className="form-control" />
                <ErrorMessage name="descripcion" component="p" className="error-message" />
              </div>
            </div>

            {vehicle && (
              <div className="vehicle-info">
                <h2>Información del Vehículo</h2>
                <table className="vehicle-table">
                  <thead>
                    <tr>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Versión</th>
                      <th>Color</th>
                      <th>Año</th>
                    </tr>
                  </thead>
                  <tbody>
  {vehicle.map((veh) => (
    <tr key={veh.id}> 
      <td>{veh.placa}</td>
      <td>{veh.marca}</td>
      <td>{veh.modelo}</td>
      <td>{veh.veersion}</td>
      <td>{veh.color}</td>
      <td>{veh.año}</td>
    </tr>
  ))}
  </tbody>

                </table>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="button-primary">
                Registrar Accidente
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default FormAccident;
