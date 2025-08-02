import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

import "./styleAccesory.css";
export default function FormAccesory() {
  const [isEditing, setisEditing] = useState(false);
  const [searchAccesory, setsearchAccesory] = useState("")

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

  return (
    <Formik
      initialValues={{
        nombre: "",
        descripcion: "",
        fecha: "",
        id_estado_a_i: "1",
      }}
      //   validate={clientsValidation}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        setisEditing(false);
        resetForm();
      }}
    >
      {({ isSubmitting, handleChange, setValues }) => (
        <Form>
          <div className="sectionAccesory">
            <div className="group">
                  <div className="field">
                    <label className="label">Buscar Accesorio </label>
                    <div className="control">
                      <Field
                        className="input"
                        type="text"
                        // name=""
                        value={searchAccesory}
                        placeholder="Ingrese los datos del accesorio"
                        onChange={(e) => {
                          setsearchAccesory(e.target.value);
                            // handleChange(e);
                        //   setSearchClient(e.target.value);
                        }}
                      ></Field>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Procesar Busqueda</label>
                    <div className="control">
                      <button
                        className="buttonSeach"
                        type="button"
                        onClick={() => {
                          searcAccesory(setValues);
                        }}
                      >
                        Buscar Accesorio
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
                    placeholder="Nombre"
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
                <label className="label">Descripcion</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="descripcion"
                    placeholder="descripcion"
                  />
                  <ErrorMessage
                    name="descripcion"
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
                    placeholder="Fecha "
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
                <Field
                  as="select"
                  name="id_estado_a_i"
                  onChange={(e) => {
                    handleChange(e);
                    //   setTipoBusqueda(e.target.value);
                  }}
                >
                  <option value="1">Activo</option>
                  <option value="2">Inactivo</option>
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
            {isEditing ? "Actualizar" : "Registrar"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
