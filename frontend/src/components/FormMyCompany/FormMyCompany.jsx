import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import "./styleMyCompany.css";

export default function FormMyCompany() {
  const [searchClient, setSearchClient] = useState([]);
  const handleSubmit = (values) => {
    console.log(values);
  };

  function searchUser(setFormikValues) {
    axios
      .post(`http://localhost:3000/api/client/${searchClient}`, {
        email: searchClient,
      })
      .then((response) => {
        // setisEditing(true);
        console.log(response.data[0]);
        setFormikValues({
          ...response.data[0],
          tipoDocumento: response.data[0].id_tipoDocumento,
          numeroDocumento: response.data[0].documentoIdentidad,
          fechaNacimiento: response.data[0].fechaNacimiento.split("T")[0],
          sexo: response.data[0].id_sexo,
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se encontraron datos!",
          });
        }
      });
  }

  return (
    <Formik
      initialValues={{
        nombre: "",
        descripcion: "",
        fecha: "",
        id_estado_a_i: "",
      }}
      //   validate={clientsValidation}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values /*, isEditing*/);
        // setisEditing(false);
        resetForm();
        setSearchClient("");
      }}
    >
      {({ isSubmitting, handleChange, setValues }) => (
        <Form>
          <Field
            as="select"
            name="tipo_entidad"
            onChange={(e) => {
              handleChange(e);
              if (e.target.value === "2") {
                // setIsClient(false);
              }
            }}
          >
            {/* {initialEntitiesValues.map((entity) => (
                  <option
                    key={entity.id_tipo_entidad}
                    value={entity.id_tipo_entidad}
                  >
                    {entity.nombre}
                  </option>
                ))} */}
          </Field>
          <div className="sectionCategory">
            <div className="group">
              <div className="field">
                <label className="label">Buscar registro Empresa</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="searchClient"
                    // value={searchClient}
                    placeholder="Ingrese los datos del cliente"
                    onChange={(e) => {
                      handleChange(e);
                      //   setSearchClient(e.target.value);
                    }}
                  ></Field>
                  <ErrorMessage
                    name="searchClient"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Filtro de Busqueda</label>
                <div className="control">
                  <Field
                    as="select"
                    name="filtroSearch"
                    onChange={(e) => {
                      handleChange(e);
                      //   setTipoBusqueda(e.target.value);
                    }}
                  >
                    <option value="email">Email</option>
                  </Field>
                  {/* <ErrorMessage
                        name="nombre"
                        component="p"
                        className="help is-danger"
                      /> */}
                </div>
              </div>
              <div className="field">
                <label className="label">Procesar Busqueda</label>
                <div className="control">
                  <button
                    className="buttonSeach"
                    type="button"
                    onClick={() => {
                      searchUser(setValues);
                    }}
                  >
                    Buscar Cliente
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
                <label className="label">Eslogan</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="eslogan"
                    placeholder="eslogan"
                  />
                  <ErrorMessage
                    name="eslogan"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Logo</label>
                <div className="control">
                  <Field
                    className="input"
                    type="file"
                    // multiple
                    accept="image/png"
                    name="Logo"
                    placeholder="Logo"
                  />
                  <ErrorMessage
                    name="Logo"
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
                    name="estado"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Seleccione el estado</option>
                    {/* {sexo.map((entity) => (
                      <option key={entity.id_sexo} value={entity.id_sexo}>
                        {entity.sexo}
                      </option>
                    ))} */}
                  </Field>
                  <ErrorMessage
                    name="estado"
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
            </div>

            <div className="group">
              <div className="field">
                <label className="label">Mision</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="mision"
                    placeholder="mision"
                  />
                  <ErrorMessage
                    name="mision"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Vision</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="vision"
                    placeholder="vision"
                  />
                  <ErrorMessage
                    name="vision"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Valores</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="valores"
                    placeholder="valores"
                  />
                  <ErrorMessage
                    name="valores"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <div className="field">
                <label className="label">Instagram</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="instagram"
                    placeholder="instagram"
                  />
                  <ErrorMessage
                    name="instagram"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Facebook</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="facebook"
                    placeholder="facebook"
                  />
                  <ErrorMessage
                    name="facebook"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Whatsapp</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="whatsapp"
                    placeholder="whatsapp"
                  />
                  <ErrorMessage
                    name="whatsapp"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">X</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="x"
                    placeholder="x"
                  />
                  <ErrorMessage
                    name="x"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <div className="group">
              <div className="field">
                <label className="label">Numero de la oficina</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="numOficina"
                    placeholder="Ingrese el numero"
                  />
                  <ErrorMessage
                    name="numOficina"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Horario</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="horario"
                    placeholder="horario"
                  />
                  <ErrorMessage
                    name="horario"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">email</label>
                <div className="control">
                  <Field
                    className="input"
                    type="email"
                    name="email"
                    placeholder="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">nota</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="nota"
                    placeholder="nota"
                  />
                  <ErrorMessage
                    name="nota"
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
                    name="estado"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Seleccione el estado</option>
                    {/* {sexo.map((entity) => (
                      <option key={entity.id_sexo} value={entity.id_sexo}>
                        {entity.sexo}
                      </option>
                    ))} */}
                  </Field>
                  <ErrorMessage
                    name="estado"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="button-is-primary">
            Registrar Cliente
            {/* {isEditing ? "Actualizar Cliente" : "Registrar Cliente"} */}
          </button>
        </Form>
      )}
    </Formik>
  );
}
