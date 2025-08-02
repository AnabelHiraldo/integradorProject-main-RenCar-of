import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./cancel.css";

export default function FormPoliticaCancel() {
  const [searchPolitica, setSearchPolitica] = useState("");
  const [status, setStatus] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/status')
      .then(response => setStatus(response.data))
      .catch(error => {
        console.error('Error al obtener los estados:', error);
      });
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    axios
      .post('http://localhost:3000/api/PoliticaCancel', values)
      .then(response => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data,
        });
        resetForm(); 
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hubo un error al registrar la política de cancelación",
        });
      });
  };

  return (
    <section className="sectionPoliticasCancelacion">
      <header>
        <h1>Políticas de Cancelación</h1>
      </header>

      <Formik
        initialValues={{
          id_politica: "",
          descripcion: "",
          dias_antes: "",
          penalidad_porcentaje: "",
          id_estado_a_i: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, setValues }) => (
          <Form>
            <div className="sectionEmpleados">
              <div className="group">
                <div className="field">
                  <label className="label">Buscar Política</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="text"
                      name="searchPolitica"
                      placeholder="Ingrese la descripción de la política"
                      onChange={(e) => {
                        handleChange(e);
                        setSearchPolitica(e.target.value);
                      }}
                    />
                    <ErrorMessage
                      name="searchPolitica"
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
                      Buscar Política
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
                      placeholder="Descripción de la política"
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
                  <label className="label">Días Antes</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="number"
                      name="dias_antes"
                      placeholder="Días antes de la cancelación"
                    />
                    <ErrorMessage
                      name="dias_antes"
                      component="p"
                      className="help is-danger"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Penalidad (%)</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="number"
                      name="penalidad_porcentaje"
                      placeholder="Penalidad en porcentaje"
                      step="0.01"
                    />
                    <ErrorMessage
                      name="penalidad_porcentaje"
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
                Registrar Política de Cancelación
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
