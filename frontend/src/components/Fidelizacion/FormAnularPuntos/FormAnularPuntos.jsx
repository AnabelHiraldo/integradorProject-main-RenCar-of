import React, { useEffect, useState } from "react";
import { ErrorMessage, Form, Formik, Field } from "formik";
import "./FormAnularPuntos.css";
import Select from "react-select";
import axios from "axios";

export default function FormAnularPuntos() {
  const [clientData, setClientData] = useState([]);
  const [rentData, setRentData] = useState([]);
  const [filteredRentData, setFilteredRentData] = useState([]);
  const [puntosCanjeados, setPuntosCanjeados] = useState(0);
  const [penalidad, setPenalidad] = useState([])
  const [puntosDeducir, setPuntosDeducir] = useState(0)

  useEffect(() => {
    axios.get("http://localhost:3000/api/clients").then((response) => {
      setClientData(response.data);
    });
    axios.get("http://localhost:3000/api/rent/getAll").then((response) => {
      setRentData(response.data);
      setFilteredRentData(response.data); 
      // console.log(response.data)
    });
    axios.get("http://localhost:3000/api/penalidad").then((response) => {
        setPenalidad(response.data);
    });


    
  }, []);

//   const handlepuntosDeducidos = (setFieldValues) =>{
//     setFieldValues("puntos_anulados", puntosDeducir.puntos_a_deducir || 0)
//   }

  const handleClientChange = (selectedOption, setFieldValue) => {
    if (selectedOption) {
      const filteredData = rentData.filter(
        (rent) => rent.id_cliente === selectedOption.value
      );
      setFilteredRentData(filteredData);
    } else {
      setFilteredRentData(rentData);
    }
    setFieldValue("id_cliente", selectedOption?.value || "");
  };

  const handleRentChange = (selectedOption, setFieldValue, values) => {
    if (selectedOption) {
      const associatedClient = clientData.find(
        (client) =>
          rentData.find(
            (rent) =>
              rent.id_renta === selectedOption.value &&
              rent.id_cliente === client.id_cliente
          )?.id_cliente === client.id_cliente
      );

      if (
        associatedClient &&
        values.id_cliente !== associatedClient.id_cliente
      ) {
        setFieldValue("id_cliente", associatedClient.id_cliente);
        handleClientChange(
          { value: associatedClient.id_cliente },
          setFieldValue
        );
      }
    }
    setFieldValue("id_renta", selectedOption?.value || "");
    setPuntosCanjeados(selectedOption || 0);
  };

 const handleSubmit = (values) =>{
    console.log(values)
    axios.post("http://localhost:3000/api/anularPuntos",values).then((response) => {
         console.log(response)
 });


    
 }

  return (
    <div className="sectionAnularPuntos">
      <div className="contentPoints">
        <div className="titleAnular">
          <strong>Anular Puntos</strong>
        </div>

        <Formik
          initialValues={{
            id_cliente: "",
            id_renta: "",
            puntos_anulados: "",
            id_penalidad: "",
            motivo: "",
          }}
          onSubmit={(values, {resetForm}) => {
            handleSubmit(values)
          }}
        >
          {({ handleChange, setFieldValue, values }) => (
            <Form>
              <div className="searchByclientOrRent">
                <div className="field">
                  <label className="label">Buscar Por cliente</label>
                  <div className="control">
                    <Select
                      options={clientData.map((cdata) => ({
                        value: cdata.id_cliente,
                        label: cdata.nombre,
                      }))}
                      name="id_cliente"
                      placeholder="Seleccione el cliente"
                      isClearable
                      isSearchable
                      value={
                        values.id_cliente
                          ? {
                              value: values.id_cliente,
                              label:
                                clientData.find(
                                  (item) =>
                                    item.id_cliente === values.id_cliente
                                )?.nombre || "",
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleClientChange(selectedOption, setFieldValue)
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Buscar Renta</label>
                  <div className="control">
                    <Select
                      options={filteredRentData.map((cdata) => ({
                        value: cdata.id_renta,
                        label: `Renta #${cdata.id_renta}`,
                        puntosObtenidos: cdata.puntosObtenidos || 0,
                      }))}
                      name="id_renta"
                      placeholder="Seleccione el número de renta"
                      isClearable
                      isSearchable
                      value={
                        values.id_renta
                          ? {
                              value: values.id_renta,
                              label: `Renta #${values.id_renta}`,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleRentChange(selectedOption, setFieldValue, values)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="textMotivAndCant">
                <div className="textAnularMotiv">
                  <label htmlFor="">Motivo de suspensión</label>
                  <textarea
                    name="motivo"
                    placeholder="Motivo de suspensión"
                    // value={values.motivo}
                    onChange={(e)=>{
                        setFieldValue("motivo", e.target.value)
                    }}
                  />
                </div>
                <div className="cantPoints">
                  <div className="field">
                    <div className="control">
                      <label className="label">
                        Puntos Otorgados:{" "}
                        {puntosCanjeados.puntosObtenidos || 0}
                      </label>
                    </div>
                  </div>
                  <div className="fieldMayor">
                    <div className="field">
                      <div className="control">
                      <Select
                      options={penalidad.map((cdata) => ({
                        value: cdata.id_penalidad,
                        label: cdata.nombre,
                        puntos_a_deducir: cdata.puntos_a_deducir || 0,
                      }))}
                      name="id_penalidad"
                      placeholder="Penalidad"
                      className="penalidad"
                      isClearable
                      isSearchable
                      value={
                        values.id_penalidad
                          ? {
                              value: values.id_renta,
                              label: penalidad.find((item)=>item.id_penalidad === values.id_penalidad)?.nombre || ""
                            }
                          : null
                      }
                      onChange={(selectedOption) =>{
                        setFieldValue("id_penalidad",selectedOption?.value)
                        setPuntosDeducir(selectedOption || 0)
                        // handlepuntosDeducidos(setFieldValue)
                        setFieldValue("puntos_anulados", selectedOption?.puntos_a_deducir)

                      }
                      }
                    />
                      </div>
                    </div>
                    <div className="field">
                      <div className="control">
                        <Field
                          name="puntos_anulados"
                          placeholder="Cantidad a anular"
                          value={values.puntos_anulados}
                          className="input"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="buttonSaveOrCancel">
                <div className="contentButton">
                  <div className="field">
                    <div className="control">
                      <button type="submit" className="buttonConf">
                        Confirmar Anulación
                      </button>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button type="button" className="buttonCanc">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
