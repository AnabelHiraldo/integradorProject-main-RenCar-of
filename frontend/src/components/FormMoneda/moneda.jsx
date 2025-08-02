import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./moneda.css";

export default function FormMoneda() {
  const [searchTipoMoneda, setSearchTipoMoneda] = useState("");
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
      .post('http://localhost:3000/api/modena', values) 
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
          text: "Hubo un error al registrar el tipo de moneda",
        });
      });
  };

  return (
    <section className="sectionEmpleados">
      <header>
        <h1>Tipos de Monedas</h1>
      </header>
    <Formik

    
      initialValues={{
        id_tipo_moneda: "",
        moneda: "",
        valor: "",
        fecha: "",
        id_estado_a_i: "",
      }}
      onSubmit={handleSubmit} 
    >
      {({ isSubmitting, handleChange, setValues }) => (
        <Form>
          <div className="sectionTipoMoneda">
            <div className="group">
              <div className="field">
                <label className="label">Buscar Tipo de Moneda</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="searchTipoMoneda"
                    placeholder="Ingrese el nombre de la moneda"
                    onChange={(e) => {
                      handleChange(e);
                      setSearchTipoMoneda(e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name="searchTipoMoneda"
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
                    Buscar Moneda
                  </button>
                </div>
              </div>
            </div>

            <div className="group_medio">
              <div className="field">
                <label className="label">Moneda</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="moneda"
                    placeholder="Nombre de la moneda"
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="moneda"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Valor</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="valor"
                    placeholder="Valor de la moneda"
                    step="0.01"
                  />
                  <ErrorMessage
                    name="valor"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Fecha</label>
                <div className="control">
                  <Field
                    className="input"
                    type="date"
                    name="fecha"
                    placeholder="Fecha de registro"
                  />
                  <ErrorMessage
                    name="fecha"
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
              Registrar Tipo de Moneda
            </button>
          </div>
        </Form>
      )}
    </Formik>
     </section>
  );
}
