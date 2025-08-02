import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./reason.css";

export default function FormCancelReason() {
  const [searchRazonCancelacion, setSearchRazonCancelacion] = useState("");
  const [status, setStatus] = useState([]);

  // Cargar los estados desde la API
  useEffect(() => {
    axios.get('http://localhost:3000/api/status')
      .then(response => setStatus(response.data))
      .catch(error => {
        console.error('Error al obtener los estados:', error);
      });
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = (values, { resetForm }) => {
    axios
      .post('http://localhost:3000/api/CancelReason', values) // Aquí cambias a la ruta adecuada
      .then(response => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data,
        });
        resetForm(); // Limpiar el formulario
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hubo un error al registrar la razón de cancelación",
        });
      });
  };

  return (
    <section className="sectionEmpleados">
      <header>
        <h1>Razones de Cancelación</h1>
      </header>
      <Formik
        initialValues={{
          id_razon: "",
          descripcion: "",
          id_estado_a_i: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, setValues }) => (
          <Form>
            <div className="sectionTipoMoneda">
              {/* Campo de búsqueda */}
              <div className="group">
                <div className="field">
                  <label className="label">Buscar Razón de Cancelación</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="text"
                      name="searchRazonCancelacion"
                      placeholder="Ingrese la descripción de la razón"
                      onChange={(e) => {
                        handleChange(e);
                        setSearchRazonCancelacion(e.target.value);
                      }}
                    />
                    <ErrorMessage
                      name="searchRazonCancelacion"
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
                    
                      }}
                    >
                      Buscar Razón
                    </button>
                  </div>
                </div>
              </div>

      
              <div className="group_medio">
                <div className="field">
                  <label className="label">Descripción</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="text"
                      name="descripcion"
                      placeholder="Descripción de la razón de cancelación"
                      onChange={handleChange}
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
                Registrar Razón de Cancelación
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
