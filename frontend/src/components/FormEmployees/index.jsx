// import { validate } from "../../validations/vehicles.js";
import { ErrorMessage, Field, Form, Formik, FieldArray } from "formik";
import "./styleEmployees.css";
import Select from "react-select"

import { useEffect, useState } from "react";
import axios from "axios";

export default function FormEmployees() {
  const [sexo, setSexo] = useState([]);
  const [typeDocument, setTypeDocument] = useState([])
  const [province, setProvince] = useState([])
  const [tipoTelefono, setTipoTelefono] = useState([])



  const handleSubmit = (values) => {
    axios.post("http://localhost:3000/api/employee", values).then((response) => {
        console.log(response.data);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/sexo").then((response) => {
      setSexo(response.data);
    });
    axios.get("http://localhost:3000/api/province").then((response) => {
      setProvince(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/api/typeDocument").then((response) => {
      setTypeDocument(response.data);
      console.log(response.data);
    });
    axios.get("http://localhost:3000/api/telephoneType").then((response)=>{
      setTipoTelefono(response.data)
      console.log(response.data)
    })
  }, []);


  return (
    <section className="sectionEmpleados">
      <header>
        <h1>Formulario Empleados</h1>
      </header>
      <Formik
        initialValues={{
          nombre: "",
          apellido: "",
          FechaNacimiento: "",
          documentoIDENTIDAD: "",
          typeDocument: "",
          email: "",
          FechaIngreso: "",
          sexo: "",
          estado: "",
        }}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm({
            tipo_entidad: "",
            nombre: "",
            apellido: "",
            fechaNacimiento: "",
            numeroDocumento: "",
            tipoDocumento: "",
            documentoIdentidad: "",
            email: "",
            fechaIngreso: "",
            estado: "",
            sexo: "",
          });
        }}
      >
        {({ isSubmitting , setFieldValue, handleChange, values}) => (
          <Form>
            <div className="group">
              <div className="field">
                <label className="label">Nombre</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="nombre"
                    placeholder="nombre"
                  ></Field>
                  <ErrorMessage
                    name="nombre"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Apellido</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="apellido"
                    placeholder="apellido"
                  ></Field>
                  <ErrorMessage
                    name="apellido"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Fecha De Nacimiento</label>
                <div className="control">
                  <Field
                    className="input"
                    type="date"
                    name="FechaNacimiento"
                  ></Field>
                  <ErrorMessage
                    name="FechaNacimiento"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div className="group_medio">
              <div className="field">
                <label className="label">Numero Documento</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="documentoIDENTIDAD"
                    placeholder="Numero de documento"
                  ></Field>
                  <ErrorMessage
                    name="documentoIDENTIDAD"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Tipo De Documento</label>
                <div className="control">
                  <Field
                    className="select"
                    as="select"
                    name="typeDocument"
                    onChange = {(e)=>{
                      handleChange(e);
                    }}
                  >
                    <option value="">Selecciona el tipo de documento</option>
                    {
                    typeDocument.map((tdocument) => (
                      <option key={tdocument.id_tipoDocumento} value={tdocument.id_tipoDocumento}>
                        {tdocument.documento}
                      </option>
                    ))};
                  </Field>
                  <ErrorMessage
                    name="typeDocument"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Sexo</label>
                <div className="control">
                  <Field
                    className="select"
                    as="select"
                    name="sexo"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Selecciona el Sexo</option>
                    
                    {
                    sexo.map((sexo) => (
                      <option key={sexo.id_sexo} value={sexo.id_sexo}>
                        {sexo.sexo}
                      </option>
                    ))};
                  </Field>
                  <ErrorMessage
                    name="sexo"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <Field
                    className="input"
                    type="email"
                    name="email"
                    placeholder="email"
                  ></Field>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Fecha Ingreso</label>
                <div className="control">
                  <Field
                    className="input"
                    type="date"
                    name="FechaIngreso"
                  ></Field>
                  <ErrorMessage
                    name="FechaIngreso"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Estado</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="estado"
                    placeholder="estado"
                  ></Field>
                  <ErrorMessage
                    name="estado"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div className="group">
                 {/* Campo para Direcciones */}
                 <div className="field">
                <label className="label">Direcciones</label>
                <FieldArray name="direccion">
                  {({ insert, remove, push }) => (
                    <>
                      <div className="direccion-container">
                        {values.direccion?.map((direccion, index) => (
                          <div key={index} className="field-group">
                            {/* Select para provincia */}
                            <Select
                              options={province.map((prov) => ({
                                value: prov.id_provincia,
                                label: prov.provincia,
                              }))}
                              placeholder="Seleccione la provincia"
                              name={`direccion.${index}.id_provincia`}
                              isSearchable
                              isClearable
                              value={
                                values.direccion[index]?.id_provincia
                                  ? {
                                      value:
                                        values.direccion[index]?.id_provincia,
                                      label:
                                        province.find(
                                          (item) =>
                                            item.id_provincia ===
                                            values.direccion[index]
                                              ?.id_provincia
                                        )?.provincia || "",
                                    }
                                  : null
                              }
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  `direccion.${index}.id_provincia`,
                                  selectedOption?.value || ""
                                );
                                setFieldValue(
                                  `direccion.${index}.provincia`,
                                  selectedOption?.label || ""
                                );

                                // Cargar las ciudades para esta provincia y este índice
                                axios
                                  .get(
                                    `http://localhost:3000/api/ciudad/${selectedOption?.value}`
                                  )
                                  .then((response) => {
                                    setFieldValue(
                                      `direccion.${index}.ciudades`,
                                      response.data || []
                                    );
                                  });

                                // Limpiar el valor de la ciudad cuando cambia la provincia
                                setFieldValue(
                                  `direccion.${index}.id_ciudad`,
                                  ""
                                );
                                setFieldValue(`direccion.${index}.ciudad`, "");
                              }}
                            />

                            {/* Select para ciudad */}
                            <Select
                              options={
                                values.direccion[index]?.ciudades?.map(
                                  (ciudad) => ({
                                    value: ciudad.id_ciudad,
                                    label: ciudad.ciudad,
                                  })
                                ) || []
                              }
                              placeholder="Seleccione la Ciudad"
                              name={`direccion.${index}.id_ciudad`}
                              isSearchable
                              isClearable
                              value={
                                values.direccion[index]?.id_ciudad
                                  ? {
                                      value: values.direccion[index]?.id_ciudad,
                                      label:
                                        values.direccion[index]?.ciudades?.find(
                                          (item) =>
                                            item.id_ciudad ===
                                            values.direccion[index]?.id_ciudad
                                        )?.ciudad || "",
                                    }
                                  : null
                              }
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  `direccion.${index}.id_ciudad`,
                                  selectedOption?.value || ""
                                );
                                setFieldValue(
                                  `direccion.${index}.ciudad`,
                                  selectedOption?.label || ""
                                );
                              }}
                            />

                            {/* Campo para la calle */}
                            <Field
                              name={`direccion.${index}.calle`}
                              placeholder="Calle"
                              className="input"
                            />

                            {/* Campo para la descripción del lugar */}
                            <Field
                              name={`direccion.${index}.descripcion_lugar`}
                              placeholder="Descripción del Lugar"
                              className="input"
                            />

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="button-is-danger"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            calle: "",
                            descripcion_lugar: "",
                            id_provincia: "",
                            provincia: "",
                            id_ciudad: "",
                            ciudad: "",
                            ciudades: [], // Ciudades locales para esta dirección
                          })
                        }
                        className="button-is-primary"
                      >
                        Agregar Dirección
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Campo para Teléfonos */}
              <div className="field">
                <label className="label">Teléfonos</label>
                <FieldArray name="telefono">
                  {({ insert, remove, push }) => (
                    <>
                      <div className="telefono-container">
                        {values.telefono?.map((telefono, index) => (
                          <div key={index} className="field-group">
                            {/* Select para elegir el tipo de teléfono */}
                            <Select
                              options={tipoTelefono.map((tipo) => ({
                                value: tipo.id_tipo_telefono,
                                label: tipo.tipo,
                              }))}
                              placeholder="Seleccione el tipo de teléfono"
                              name={`telefono.${index}.id_tipo_telefono`}
                              isSearchable
                              isClearable
                              value={
                                values.telefono[index]?.id_tipo_telefono
                                  ? {
                                      value:
                                        values.telefono[index]
                                          ?.id_tipo_telefono,
                                      label:
                                      tipoTelefono.find(
                                          (item) =>
                                            item.id_tipo_telefono ===
                                            values.telefono[index]
                                              ?.id_tipo_telefono
                                        )?.tipo || "",
                                    }
                                  : null
                              }
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  `telefono.${index}.id_tipo_telefono`,
                                  selectedOption?.value || ""
                                );
                                setFieldValue(
                                  `telefono.${index}.tipo_telefono`,
                                  selectedOption?.label || ""
                                );
                              }}
                            />

                            {/* Campo para el número de teléfono */}
                            <Field
                              name={`telefono.${index}.numero`}
                              placeholder="Teléfono"
                              className="input"
                            />

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="button-is-danger"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            numero: "",
                            id_tipo_telefono: "",
                            tipo_telefono: "",
                          })
                        }
                        className="button-is-primary"
                      >
                        Agregar Teléfono
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>
            </div>
            <div className="field-is-grouped">
              <div className="control">
                <button
                  className="button-is-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Enviar
                </button>
              </div>
              <div className="control">
                <button className="button-is-light" type="reset">
                  Cancelar
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
