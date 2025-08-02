import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styleCompany.css";

export default function FormCompany() {
  const [typeDocument, setTypeDocument] = useState([]);

 const handleSubmit =(values)=>{
   axios.post("http://localhost:3000/publicCompany",values).then((response)=>{
    console.log(response.data);
    console.log(values)
 })
 }


  useEffect(() => {
    axios.get("http://localhost:3000/getTypeDocument").then((response) => {
      setTypeDocument(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <Formik
       initialValues = {{
        tipo_entidad: "",
        nombre: "",
        numeroDocumento: "",
        tipoDocumento: "",
        email: "",
        fecha_registro:"",
       } }
      //   validate={companyValidation}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        resetForm({
          tipo_entidad: "",
          nombre: "",
          numeroDocumento: "",
          tipoDocumento: "",
          email: "",
          fecha_registro:"",
        });
      }}
    >
      {({ isSubmitting, handleChange }) => (
        <Form>
          <Field
            as="select"
            name="tipo_entidad"
            onChange={(e) => {
              handleChange(e);
              if (e.target.value === "1") {
                // setIsClient(true);
              }
            }}
          >
            {/*<option value="Persona">Persona</option>*/}
            <option value="2">Empresa</option>
            {/* {initialEntitiesValues.map((entity) => (
                  <option
                    key={entity.id_tipo_entidad}
                    value={entity.id_tipo_entidad}
                  >
                    {entity.nombre}
                  </option>
                ))} */}
          </Field>
          <div className="sectionCompany">
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
                      //   searchUser(setValues);
                    }}
                  >
                    Buscar Cliente
                  </button>
                </div>
              </div>
            </div>
            <div className="group">
            <div className="field">
              <label className="label">Nombre</label>
              <div className="control">
                <Field
                  className="input"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                />
                <ErrorMessage
                  name="nombre"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <Field
                  className="input"
                  type="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            </div>
       <div className="group">
       <div className="field">
              <label className="label">Tipo de Documento</label>
              <div className="control">
                <Field
                  as="select"
                  name="tipoDocumento"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                >
                  <option value="Persdddona">
                    Selecciona el tipo de documento
                  </option>
                  {typeDocument.map((entity) => (
                    <option
                      key={entity.id_tipoDocumento}
                      value={entity.id_tipoDocumento}
                    >
                      {entity.documento}
                    </option>
                  ))}
                  {/*<option value="Persona">Persona</option>*/}
                  {/*<option value="Empresa">Empresa</option>*/}
                </Field>
                <ErrorMessage
                  name="tipoDocumento"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Número de Documento</label>
              <div className="control">
                <Field
                  className="input"
                  type="text"
                  name="numeroDocumento"
                  placeholder="Número de Documento"
                />
                <ErrorMessage
                  name="numeroDocumento"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
       </div>
          
          </div>
          <button type="submit" className="button-is-primary">
            Enviar
          </button>
        </Form>
      )}
    </Formik>
  );
}
