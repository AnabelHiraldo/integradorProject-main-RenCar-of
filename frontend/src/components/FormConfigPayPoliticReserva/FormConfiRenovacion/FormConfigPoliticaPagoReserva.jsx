import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import "./FormConfigPoliticaPagoReserva.css";
import Select from "react-select";
import axios from "axios";

export default function FormPoliticaPagoReserva() {
  const [pointsMethod, setPointsMethod] = useState([]);
  const [status, setStatus] = useState([]);

  const handleSubmit = (values) => {
    axios
      .post("http://localhost:3000/api/politicPayReserva", values)
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
      <h1>Configuración de los Pago de Reserva</h1>
      <Formik
        initialValues={{
          porcentajeAPagar: 0,
          fecha: "",
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
              <h2>Configuración de pago de la Reserva</h2>
           
              <div className="form-group">
                <label htmlFor="cantidad-gastada">
                 Porcentaje a pagar
                </label>
                <Field
                  name="porcentajeAPagar"
                  id="cantidad-gastada"
                  placeholder=""
                  type="number"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="porcentajeAPagar"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="puntos-maximos">Fecha</label>
                <Field
                  type="date"
                  id="puntos-maximos"
                  name="fecha"
                  placeholder="Digite la fecha de Inicio"
                />
                <ErrorMessage
                  name="fecha"
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
