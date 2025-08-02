// import { validate } from "../../validations/vehicles.js";
import { ErrorMessage, Field, Form, Formik, FieldArray } from "formik";
import "./styleAcuerdo.css";
import Select from "react-select";

import { useEffect, useState } from "react";
import axios from "axios";

export default function FormAcuerdo() {
  const [tipoAcuerdo, setTipoAcuerdo] = useState([]);
  const [typeDocument, setTypeDocument] = useState([]);
  const [province, setProvince] = useState([]);
  const [tipoTelefono, setTipoTelefono] = useState([]);
  const [propietarioData, setPropietarioData] = useState([]);

  const handleSubmit = (values) => {

    console.log(values)
    axios
       .post("http://localhost:3000/api/acuerdo", values)
       .then((response) => {
         console.log(response.data);
     });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/propietario/all").then((response) => {
      setPropietarioData(response.data);
      // console.log(vehicleFound);
    });

    axios.get("http://localhost:3000/api/tipoAcuerdo").then((response) => {
      setTipoAcuerdo(response.data);
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
    axios.get("http://localhost:3000/api/telephoneType").then((response) => {
      setTipoTelefono(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <section className="sectionAcuerdos">
      <header>
        <h1>Formulario de Acuerdos</h1>
      </header>
      <Formik
        initialValues={{
          id_propietario: "",
          fecha_acuerdo: "",
          id_tipo_acuerdo: "",
          valor_comision_tarifa: "",
          plazo_pago: "",
          mantenimiento_incluido: "",
        }}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm({
            id_propietario: "",
            fecha_acuerdo: "",
            id_tipo_acuerdo: "",
            valor_comision_tarifa: "",
            plazo_pago: "",
            mantenimiento_incluido: "",
          });
        }}
      >
        {({ isSubmitting, setFieldValue, handleChange, values }) => (
          <Form>
            <div className="group_Propietario">
              <div className="field">
                <label className="label">Seleccione un Propietario</label>
                <div className="control">
                  <Select
                    options={propietarioData.map((brandd) => ({
                      value: brandd.id_propietario,
                      label: `${brandd.nombre} ${brandd.apellido} `,
                    }))}
                    placeholder="Seleccione el propietario"
                    isClearable
                    isSearchable
                    name="id_propietario"
                    value={
                      values.id_propietario
                        ? {
                            value: values.id_propietario,
                            label:
                              propietarioData.find(
                                (item) =>
                                  item.id_propietario === values.id_propietario
                              )?.nombre || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "id_propietario",
                        selectedOption?.value || ""
                      );
                      //Hay que arreglar esta parte de aqui para que no se ejecute si esta vacio
                      // handleModel(selectedOption.value);
                      // handleSelectChange(selectedOption, 0);
                    }}
                  />
                  <ErrorMessage
                    name="id_marca"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <div className="group">
              <div className="field">
                <label className="label">Seleccione el tipo de acuerdo</label>
                <div className="control">
                  <Select
                    options={tipoAcuerdo.map((brandd) => ({
                      value: brandd.id_tipo_acuerdo,
                      label: `${brandd.nombre}`,
                    }))}
                    placeholder="Seleccione el tipo de acuerdo"
                    isClearable
                    isSearchable
                    name="id_tipo_acuerdo"
                    value={
                      values.id_tipo_acuerdo
                        ? {
                            value: values.id_tipo_acuerdo,
                            label:
                              tipoAcuerdo.find(
                                (item) =>
                                  item.id_tipo_acuerdo ===
                                  values.id_tipo_acuerdo
                              )?.nombre || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "id_tipo_acuerdo",
                        selectedOption?.value || ""
                      );
                      //Hay que arreglar esta parte de aqui para que no se ejecute si esta vacio
                      // handleModel(selectedOption.value);
                      // handleSelectChange(selectedOption, 0);
                    }}
                  />
                  <ErrorMessage
                    name="id_marca"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">plazo de pagos</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="plazo_pago"
                    placeholder="Digite el plazo de pago del acuerdo"
                  ></Field>
                  <ErrorMessage
                    name="plazo_pago"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Fecha Del acuerdo</label>
                <div className="control">
                  <Field
                    className="input"
                    type="date"
                    name="fecha_acuerdo"
                  ></Field>
                  <ErrorMessage
                    name="fecha_acuerdo"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div className="group_medio">
              <div className="field">
                <label className="label">Monto-comision/tarifa</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="valor_comision_tarifa"
                    placeholder="Monto del acuerdo"
                  ></Field>
                  <ErrorMessage
                    name="valor_comision_tarifa"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Mantenimiento incluido</label>
                <div className="control">
                  <Select
                    options={[
                      { value: 0, label: "No" },
                      { value: 1, label: "Si" },
                    ]}
                    placeholder="Seleccione una opción"
                    name="mantenimiento_incluido"
                    isClearable
                    isSearchable
                    value={
                      values.mantenimiento_incluido !== undefined
                        ? {
                            value: values.mantenimiento_incluido,
                            label:
                              values.mantenimiento_incluido === 1 ? "Si" : "No",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "mantenimiento_incluido",
                        selectedOption?.value || 0
                      );
                    }}
                  />

                  <ErrorMessage
                    name="mantenimiento_incluido"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
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
