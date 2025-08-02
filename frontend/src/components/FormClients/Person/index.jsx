import { clientsValidation } from "../../../validations/clients.js";
import Select from "react-select";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  useFormikContext,
  FieldArray,
} from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./stylePerson.css";
import axios from "axios";

export default function PersonForm({
  handleSubmit,
  setIsClient,
  initialEntitiesValues,
  sexo,
  province,
  typeDocument,
  getClient,
}) {
  const [searchClient, setSearchClient] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState("");
  const [clientFound, setClientFound] = useState();
  const [isEditing, setisEditing] = useState(false);
  const [ciudad, setCiudad] = useState([]);
  const [tipoTelefono, setTipoTelefono] = useState([])


  const [initialValues] = useState({
    tipo_entidad: "1",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    numeroDocumento: "",
    tipoDocumento: "",
    id_sexo: "2",
    email: "",
    estado: "",
    sexo: "",
    direccion: [],
    telefono: [],
  });



  function searchUser(setFormikValues) {
    axios
      .get(`http://localhost:3000/api/clients/${searchClient}`)
      .then((response) => {
        setisEditing(true);
        setClientFound(response.data[0]);
        setFormikValues({
          ...response.data[0],
          tipoDocumento: response.data[0].id_tipoDocumento,
          numeroDocumento: response.data[0].documentoIdentidad,
          fechaNacimiento: response.data[0].fechaNacimiento.split("T")[0],
          sexo: response.data[0].id_sexo,
          direccion: response.data[0].direcciones || [{ direccion: "" }],
          telefono: response.data[0].telefonos || [{ telefono: "" }],
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
  const handlecity = (id) => {
    console.log(id);
    axios.get(`http://localhost:3000/api/ciudad/${id}`).then((response) => {
      response.data ? setCiudad(response.data) : "";
      // console.log(response.data);
    });
  };

  
  useEffect(()=>{
    axios.get("http://localhost:3000/api/telephoneType").then((response)=>{
      setTipoTelefono(response.data)
      console.log(response.data)
    })
  }, [])


  return (
    <Formik
      initialValues={initialValues}
      validate={clientsValidation}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(
          {
            id: clientFound?.id_entidad,
            ...values,
          },
          isEditing
        );
        setisEditing(false);
        resetForm();
        setSearchClient("");
      }}
    >
      {({ isSubmitting, setFieldValue, handleChange, setValues, values }) => (
        <Form>
          <Field
            as="select"
            name="tipo_entidad"
            onChange={(e) => {
              handleChange(e);
              if (e.target.value === "2") {
                setIsClient(false);
              }
            }}
          >
            {initialEntitiesValues.map((entity) => (
              <option
                key={entity.id_tipo_entidad}
                value={entity.id_tipo_entidad}
              >
                {entity.nombre}
              </option>
            ))}
          </Field>
          <div className="sectionPerson">
            <div className="group">
              <div className="field">
                <label className="label">Buscar Cliente</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="searchClient"
                    value={searchClient}
                    placeholder="Ingrese los datos del cliente"
                    onChange={(e) => {
                      setSearchClient(e.target.value);
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
                      setTipoBusqueda(e.target.value);
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
                <label className="label">Apellido</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                  />
                  <ErrorMessage
                    name="apellido"
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
                    <option value="">Seleccione el tipo de documento</option>
                    {typeDocument.map((entity) => (
                      <option
                        key={entity.id_tipoDocumento}
                        value={entity.id_tipoDocumento}
                      >
                        {entity.documento}
                      </option>
                    ))}
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

              <div className="field">
                <label className="label">Fecha de Nacimiento</label>
                <div className="control">
                  <Field
                    className="input"
                    type="date"
                    name="fechaNacimiento"
                    placeholder="Fecha de Nacimiento"
                  />
                  <ErrorMessage
                    name="fechaNacimiento"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <div className="group"></div>
            <div className="group">
              <div className="field">
                <label className="label">Sexo</label>
                <div className="control">
                  <Field
                    as="select"
                    name="sexo"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Seleccione el sexo</option>
                    {sexo.map((entity) => (
                      <option key={entity.id_sexo} value={entity.id_sexo}>
                        {entity.sexo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="sexo"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

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

              {/* Consola de Valores para Debugging */}
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            </div>
          </div>
          <button type="submit" className="button-is-primary">
            {isEditing ? "Actualizar Cliente" : "Registrar Cliente"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
