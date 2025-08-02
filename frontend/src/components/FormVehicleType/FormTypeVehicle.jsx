import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import "./styleTypeVehicle.css";
import { useEffect, useState } from "react";

export default function FormVehicleType() {
  const [typeVehicle, setTypeVehicle] = useState([]);
  const [isEditing, setisEditing] = useState(false);
  const [status, setStatus] = useState([]);
  const handleSubmit = (values) => {
    console.log(values);

    const url = `http://localhost:3000/api/${
      !isEditing ? "vehicleType" : `vehicleType/${typeVehicle}`
    }`;

    const method = !isEditing ? "post" : "put";

    axios[method](url, values).then((response) => {
      console.log(response)
    }).catch((error)=>{
      console.log(error)
    });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/status").then((response) => {
      setStatus(response.data);
    });
  }, []);

  function searchTypeVehicle(setFormikValues) {
    axios
      .get(`http://localhost:3000/api/vehicleType/${typeVehicle}`)
      .then((response) => {
        setisEditing(true);
        console.log(response.data[0]);
        setFormikValues({
          nombre: response.data.nombre,
          descripcion: response.data.descripcion,
          id_estado_a_i: response.data.id_estado_a_i,
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
        id_estado_a_i: "",
      }}
      //   validate={clientsValidation}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        setisEditing(false);
        resetForm();
      }}
    >
      {({  handleChange, setValues }) => (
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
                <label className="label">Buscar Tipo de vehiculo</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="searchType"
                    value={typeVehicle}
                    placeholder="Ingrese los datos del tipo de vehiculo"
                    onChange={(e) => {
                      setTypeVehicle(e.target.value);
                    }}
                  ></Field>
                  <ErrorMessage
                    name="searchType"
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
                      searchTypeVehicle(setValues);
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
                <label className="label">Estado</label>
                <div className="control">
                  <Field
                    as="select"
                    name="id_estado_a_i"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
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
            {isEditing ? "Actualizar Tipo de vehiculo" : "Registrar Tipo de Vehiculo"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
