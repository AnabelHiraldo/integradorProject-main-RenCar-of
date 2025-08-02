import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import "./styleFormConfigRENOVACION.css";
import Select from "react-select";
import axios from "axios";

export default function FormConfigRenovacion() {
  const [pointsMethod, setPointsMethod] = useState([]);
  const [status, setStatus] = useState([]);

  const handleSubmit = (values) => {
    axios
      .post("http://localhost:3000/api/configRenovacion", values)
      .then((response) => {
        console.log(response);
      });
    console.log(values);
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/status").then((response) => {
      setStatus(response.data);
       console.log(response.data);
    });
  }, []);
  return (
    <div className="fidelizacion-container">
      <h1>Configuración de las Renovaciones</h1>
      <Formik
        initialValues={{
          tiempoMaximoExtension: 0,
          tiempoMinimoExtension: "",
          cantidadXRenta: 0,
          id_estado_a_i: 1,
        }}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
        }}
      >
        {({ handleChange, setFieldValue, values }) => (
          <Form>
            <div className="section">
              <h2>Configuración de Renovacion</h2>
           
              <div className="form-group">
                <label htmlFor="cantidad-gastada">
                 Tiempo Maximo de extension (Dias)
                </label>
                <Field
                  name="tiempoMaximoExtension"
                  id="cantidad-gastada"
                  placeholder=""
                  type="number"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="tiempoMaximoExtension"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pedido-minimo">
                 Tiempo Minimo de Extension (Dias)
                </label>
                <Field
                  name="tiempoMinimoExtension"
                  placeholder=""
                  id="pedido-minimo"
                  type="number"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="tiempoMinimoExtension"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="puntos-maximos">
                  Cantidad de renovaciones por renta:
                </label>
                <Field
                  type="number"
                  id="puntos-maximos"
                  name="cantidadXRenta"
                  placeholder="Digite la cantidad de veces que puede renovarse una renta"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="cantidadXRenta"
                  component="p"
                  className="help is-danger"
                />
              </div>
              <div className="form-group">
                <label htmlFor="pedido-vencimiento">Estado:</label>
                <div className="vencimiento-group">
                  <Select
                    options={status.map((stat) => ({
                      value: stat.id_estado_a_i,
                      label: stat.estado,
                    }))}
                    placeholder="Seleccione un estado"
                    isClearable
                    isSearchable
                    isDisabled
                    name="id_estado_a_i"
                    value={
                      values.id_estado_a_i
                        ? {
                            value: values.id_estado_a_i,
                            label:
                              status.find(
                                (item) =>
                                  item.id_estado_a_i === values.id_estado_a_i
                              )?.estado || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "id_estado_a_i",
                        selectedOption?.value || ""
                      );
                    }}
                  />

                  <ErrorMessage
                    name="id_estado_a_i"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <button className="save-button" type="submit">
              Guardar Configuración
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
