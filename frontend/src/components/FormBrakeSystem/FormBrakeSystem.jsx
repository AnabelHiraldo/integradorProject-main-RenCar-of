import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./styleBrakeSystem.css";

export default function FormBrakeSystem() {
  const [status, setStatus] = useState([]);
  const [brakeSystem, setBrakeSystem] = useState("");
  const [isEditing, setisEditing] = useState(false);

  const handleSubmit = (values) => {
    const url = `http://localhost:3000/api/${
       !isEditing ? "brakeSystem" : `brakeSystem/${brakeSystem}`
     }`;
    console.log(values)

    const method = !isEditing ? "post" : "put";

     axios[method](url, values)
      .then((response) => {
         console.log(response);

         // Swal.fire({
         //   icon: "success",
         //   title: "Color guardado",
         //   showConfirmButton: false,
         //   timer: 1500,
       // });
       })
       .catch((error) => {
         console.log(error);
       });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/status").then((response) => {
      setStatus(response.data);
    });
  }, []);

  function searchBrakeSystem(setFormikValues, value) {
    axios
      .get(`http://localhost:3000/api/brakeSystem/${brakeSystem}`)
      .then((response) => {
        setisEditing(true);
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
      {({ isSubmitting, handleChange, setValues }) => (
        <Form>
          <div className="sectionCategory">
            <div className="group">
              <div className="field">
                <label className="label">Buscar Sistema de frenos</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    placeholder="ID"
                    value={brakeSystem}
                    onChange={(e) => {
                      setBrakeSystem(e.target.value);
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
                      searchBrakeSystem(setValues);
                    }}
                  >
                    Buscar Sistema de frenos
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
                    as="textarea"
                    className="input"
                    type="text"
                    style={{ height: "10vh", resize: "none" }}
                    name="descripcion"
                    rows="4"
                    placeholder="Descripcion"
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
              {/* <div className="field">
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
              </div> */}
            </div>
          </div>
          <button type="submit" className="button-is-primary">
            {isEditing
              ? "Actualizar Sistema de frenos"
              : "Registrar Sistema de frenos"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
