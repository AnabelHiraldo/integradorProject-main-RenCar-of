import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./part.css";

export default function FormVehiclePart() {
  const [searchParteVehiculo, setSearchParteVehiculo] = useState("");
  const [status, setStatus] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/status")
      .then((response) => setStatus(response.data))
      .catch((error) => {
        console.error("Error al obtener los estados:", error);
      });
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    axios
      .post("http://localhost:3000/api/partVehicle", values) 
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data,
        });
        resetForm();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hubo un error al registrar la parte del vehículo",
        });
      });
  };

  return (
    <section className="sectionEmpleados">
      <header>
        <h1>Partes de Vehículo</h1>
      </header>
      <Formik
        initialValues={{
          id_parte: "",
          nombre: "",
          descripcion: "",
          id_estado_a_i: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <div className="sectionForm">
           
              <div className="group">
                <div className="field">
                  <label className="label">Buscar Parte del Vehículo</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="text"
                      name="searchParteVehiculo"
                      placeholder="Ingrese el nombre de la parte"
                      onChange={(e) => {
                        handleChange(e);
                        setSearchParteVehiculo(e.target.value);
                      }}
                    />
                    <ErrorMessage
                      name="searchParteVehiculo"
                      component="p"
                      className="help is-danger"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Procesar Búsqueda</label>
                  <div className="control">
                    <button
                      className="buttonSearch"
                      type="button"
                      onClick={() => {
                        console.log("Buscar parte del vehículo:", searchParteVehiculo);
                      }}
                    >
                      Buscar Parte
                    </button>
                  </div>
                </div>
              </div>

         
              <div className="group_medio">
                <div className="field">
                  <label className="label">Nombre</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="text"
                      name="nombre"
                      placeholder="Nombre de la parte"
                    />
                    <ErrorMessage
                      name="nombre"
                      component="p"
                      className="help is-danger"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Descripción</label>
                  <div className="control">
                    <Field
                      as="textarea"
                      className="textarea"
                      name="descripcion"
                      placeholder="Descripción de la parte"
                    />
                    <ErrorMessage
                      name="descripcion"
                      component="p"
                      className="help is-danger"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Estado</label>
                  <div className="control">
                    <Field
                      as="select"
                      name="id_estado_a_i"
                      className="select"
                      onChange={handleChange}
                    >
                      <option value="">Seleccione el estado</option>
                      {status.map((status) => (
                        <option
                          key={status.id_estado_a_i}
                          value={status.id_estado_a_i}
                        >
                          {status.estado}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="id_estado_a_i"
                      component="p"
                      className="help is-danger"
                    />
                  </div>
                </div>
              </div>

           
              <button type="submit" className="button-is-primary">
                Registrar Parte del Vehículo
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
