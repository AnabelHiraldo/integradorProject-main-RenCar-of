import { ErrorMessage, Field,Form, Formik } from "formik";
import axios from "axios";
import {useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./styleUser.css"
import { useFetcher } from "react-router-dom";

export default function FormUser(){

    const [searchClient,setSearchClient] = useState([])
    const handleSubmit = (values) =>{
        console.log(values)
    }

    




    function searchUser(setFormikValues) {
        axios
          .post(`http://localhost:3000/api/client/${searchClient}`, { email: searchClient })
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
            nombre:"",
            descripcion:"",
            fecha:"",
            id_estado_a_i:""
          }}
        //   validate={clientsValidation}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values/*, isEditing*/);
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
                    <label className="label">Buscar Cliente</label>
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
                    <label className="label">Email</label>
                    <div className="control">
                      <Field
                        className="input"
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="help is-danger"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">UserName</label>
                    <div className="control">
                      <Field
                        className="input"
                        type="text"
                        name="username"
                        placeholder="username"
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="username"
                        component="p"
                        className="help is-danger"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Contraseña</label>
                    <div className="control">
                      <Field
                        className="input"
                        type="text"
                        name="contraseña"
                        placeholder="contraseña"
                      />
                      <ErrorMessage
                        name="contraseña"
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
              </div>
              <button type="submit" className="button-is-primary">
                Registrar Usuario
                {/* {isEditing ? "Actualizar Cliente" : "Registrar Cliente"} */}
              </button>
            </Form>
          )}
        </Formik>
      );
}