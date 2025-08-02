import { ErrorMessage, Field,Form, Formik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./styleTraction.css"

export default function FormTraction(){

    const [tractionFound,setTractionFound] = useState("")
    const [isEditing, setisEditing] = useState(false)
    const [status, setStatus] = useState([])
  
    const handleSubmit = (values) => {
      const url = `http://localhost:3000/api/${
        !isEditing ? "traction" : `traction/${tractionFound}`
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
  

    function searchTraction(setFormikValues) {
        axios
          .get(`http://localhost:3000/api/traction/${tractionFound}`)
          .then((response) => {
            setisEditing(true);
            console.log(response.data[0]);
            setFormikValues({
              traccion: response.data.traccion,
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
            traccion:"",
            descripcion:"",
            id_estado_a_i:""
          }}
        //   validate={clientsValidation}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
            setisEditing(false);
          }}
        >
          {({handleChange, setValues }) => (
            <Form>
              <div className="sectionCategory">
                <div className="group">
                  <div className="field">
                    <label className="label">Buscar Traccion</label>
                    <div className="control">
                      <Field
                        className="input"
                        type="text"
                        name="searchTraction"
                         value={tractionFound}
                        placeholder="Ingrese los datos del cliente"
                        onChange={(e) => {
                        setTractionFound(e.target.value);
                        }}
                      ></Field>
                      <ErrorMessage
                        name="searchTraction"
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
                          searchTraction(setValues);
                        }}
                      >
                        Buscar Traccion
                      </button>
                    </div>
                  </div>
                </div>
    
                <div className="group_medio">
                  <div className="field">
                    <label className="label">Traction</label>
                    <div className="control">
                      <Field
                        className="input"
                        type="text"
                        name="traccion"
                        placeholder="traccion"
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="traccion"
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
                {isEditing ? "Actualizar traccion" : "Registrar traccion"}
              </button>
            </Form>
          )}
        </Formik>
      );
}