import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import "./styleFormConfigPuntos.css";
import Select from "react-select";
import axios from "axios";

export default function FormConfigPuntos() {
  const [pointsMethod, setPointsMethod] = useState([]);
  const [status, setStatus] = useState([]);

  const handleSubmit = (values) => {
    axios
      .post("http://localhost:3000/api/configPuntos", values)
      .then((response) => {
        console.log(response);
      });
    console.log(values);
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/pointsMethod").then((response) => {
      setPointsMethod(response.data);
    });

    axios.get("http://localhost:3000/api/status").then((response) => {
      setStatus(response.data);
       console.log(response.data);
    });
  }, []);
  return (
    <div className="fidelizacion-container">
      <h1>Configuración del Modulo de Fidelizacion</h1>
      <Formik
        initialValues={{
          cantRentMinima: 0,
          id_metodo_punto: "",
          cantidad_punto: 0,
          consumo_requerido: 0,
          maximoPuntoCanjear: 0,
          limiteCanjeXAlquiler: 0,
          minimoPuntoCanjear: 0,
          fecha_vencimiento_punto: "",
          fecha_inicio: "",
          fecha_fin: "",
          id_estado_a_i: "",
        }}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
        }}
      >
        {({ handleChange, setFieldValue, values }) => (
          <Form>
            <div className="section">
              <h2>Configuración de puntos de ganancia</h2>
              <div className="form-group">
                <label className="habilitar-puntos">
                  Habilitar punto de recompensa
                  <Field
                    type="checkbox"
                    id="habilitar-puntos"
                    name="habilitar_puntos"
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="cantidad-gastada">
                  Cantidad requerida (dinero o rentas):
                </label>
                <Field
                  name="cantRentMinima"
                  id="cantidad-gastada"
                  placeholder=""
                  type="number"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="cantRentMinima"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pedido-minimo">
                  Cantidad de (rentas o dinero) para ganar puntos:
                </label>
                <Field
                  name="consumo_requerido"
                  placeholder=""
                  id="pedido-minimo"
                  type="number"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="consumo_requerido"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pedido-vencimiento">
                  Método de Recompensa:
                </label>
                <div className="vencimiento-group">
                  <Select
                    options={pointsMethod.map((point) => ({
                      value: point.id_metodo_punto,
                      label: point.nombre,
                    }))}
                    placeholder="Seleccione un método"
                    name="id_metodo_punto"
                    isClearable
                    isSearchable
                    value={
                      values.id_metodo_punto
                        ? {
                            value: values.id_metodo_punto,
                            label:
                              pointsMethod.find(
                                (poinm) =>
                                  poinm.id_metodo_punto ===
                                  values.id_metodo_punto
                              )?.nombre || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "id_metodo_punto",
                        selectedOption?.value || ""
                      );
                    }}
                  />
                  <ErrorMessage
                    name="id_metodo_punto"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="puntos-maximos">
                  Cantidad de puntos a otorgar:
                </label>
                <Field
                  type="number"
                  id="puntos-maximos"
                  name="cantidad_punto"
                  placeholder="Renta/dinero"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="cantidad_punto"
                  component="p"
                  className="help is-danger"
                />
              </div>
              <div className="form-group">
                <label htmlFor="puntos-maximos">Fecha Inicio</label>
                <Field
                  type="date"
                  id="puntos-maximos"
                  name="fecha_inicio"
                  placeholder="Digite la fecha de Inicio"
                />
                <ErrorMessage
                  name="fecha_inicio"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>

            <div className="section">
              <h2>Configuración de puntos para canjear</h2>
              <div className="form-group">
                <label htmlFor="canjear-importe">
                  Cantidad máxima para canjear por día:
                </label>
                <Field
                  type="number"
                  id="canjear-importe"
                  name="maximoPuntoCanjear"
                  placeholder=""
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="maximoPuntoCanjear"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="punto-minimo">
                  Cantidad de puntos mínima para canjear:
                </label>
                <Field
                  type="number"
                  id="punto-minimo"
                  name="minimoPuntoCanjear"
                  placeholder="Minimo para canjear"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="minimoPuntoCanjear"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="punto-minimo">
                  Limite de canjeo por alquiler:
                </label>
                <Field
                  type="number"
                  id="punto-minimo"
                  name="limiteCanjeXAlquiler"
                  placeholder="Minimo para canjear"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="limiteCanjeXAlquiler"
                  component="p"
                  className="help is-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pedido-vencimiento">
                  Vencimiento de puntos:
                </label>
                <div className="vencimiento-group">
                  <Field
                    type="date"
                    id="puntos-maximos"
                    name="fecha_vencimiento_punto"
                    placeholder=""
                  />
                  <ErrorMessage
                    name="fecha_vencimiento_punto"
                    component="p"
                    className="help is-danger"
                  />
                </div>
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
