import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./styleBills.css";

export default function FormBills() {
  const [status, setStatus] = useState([]);
  const [color, setcolor] = useState("");
  const [showColor, setshowColor] = useState("")
  const [isEditing, setisEditing] = useState(false);

  const handleSubmit = (values) => {
    const url = `http://localhost:3000/api/${
      !isEditing ? "colors" : `colors/${color}`
    }`;

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

  function searchColor(setFormikValues) {
    axios
      .get(`http://localhost:3000/api/colors/${color}`)
      .then((response) => {
        setisEditing(true);
        setshowColor(response.data.color);
        setFormikValues({
          color: response.data.color,
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
        id_estado_a_i: "",
      }}
      //   validate={clientsValidation}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        resetForm();
        setisEditing(false);
      }}
    >
      {({ handleChange, setValues, }) => (
        <Form>
          <div className="sectionCategory">
            <div className="group">
              <div className="field">
                <label className="label">Buscar Tipo </label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    value={nombre}
                    name="searchColor"
                    placeholder="Ingrese los datos del cliente"
                    onChange={(e) => {
                      setcolor(e.target.value);
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
                      searchColor(setValues);
                    }}
                  >
                    Buscar Color
                  </button>
                </div>
              </div>
              {
                showColor && (
                  <div style={{
                    width: '5vw',
                    height: '10vh',
                    backgroundColor: showColor,
                    borderRadius: '10%',
                  }}/>
                )
              }
            </div>

            <div className="group_medio">
              <div className="field">
                <label className="label">Tipo de Gasto</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="color"
                    placeholder="color"
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="color"
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
                    {/* <option value="">Seleccione el estado</option> */}
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
          </div>
          <button type="submit" className="button-is-primary">
            {isEditing ? "Actualizar Color" : "Registrar Color"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
