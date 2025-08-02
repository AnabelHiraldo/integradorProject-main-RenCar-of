import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./damage.css";

export default function FormDamage() {
  const [searchTipoDanio, setSearchTipoDanio] = useState("");
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
      .post('http://localhost:3000/api/damage', values) 
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
          text: "Hubo un error al registrar el tipo de daño",
        });
      });
  };

  return (
    <section className="sectionEmpleados">
      <header>
        <h1>Tipos de Daño</h1>
      </header>
      <Formik
        initialValues={{
          id_tipo_daño: "",
          nombre: "",
          descripcion: "",
          id_estado_a_i: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, setValues }) => (
          <Form>
            <div className="sectionTipoDanio">
              <div className="group">
                <div className="field">
                  <label className="label">Buscar Tipo de Daño</label>
                  <div className="control">
                    <Field
                      className="input"
                      type="text"
                      name="searchTipoDanio"
                      placeholder="Ingrese el nombre del daño"
                      onChange={(e) => {
                        handleChange(e);
                        setSearchTipoDanio(e.target.value);
                      }}
                    />
                    <ErrorMessage
                      name="searchTipoDanio"
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
                      Buscar Daño
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
                      placeholder="Nombre del daño"
                      onChange={handleChange}
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
                      className="input"
                      type="text"
                      name="descripcion"
                      placeholder="Descripción del daño"
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
                    <Field as="select" name="id_estado_a_i" onChange={handleChange}>
                      <option value="">Seleccione el estado</option>
                      {status.map((status) => (
                        <option key={status.id_estado_a_i} value={status.id_estado_a_i}>
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
                Registrar Tipo de Daño
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
