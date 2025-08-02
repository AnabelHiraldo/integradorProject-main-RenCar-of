import "./vehicle.css";
import DinamicVehicle from "../../components/DinamicVehicle/dinamicVehicle";
import Select from "react-select";
import { useEffect, useState } from "react";
import axios from "axios";
import { ErrorMessage, Field, Formik, Form } from "formik";
import Swal from "sweetalert2";
import OnlineReservation from "../OnlineReservation/OnlineReservation";
import { useNavigate } from "react-router-dom";
import GoBackButton from "../../components/GoBackButton";

export default function Vehicle({ onViewOffer }) {
  const [vehicleFound, setvehicleFound] = useState([]);
  const [brand, setBrand] = useState([]);
  const [selectValue, setSelectValue] = useState([]);
  const [model, setModel] = useState([]);
  const [brakeSystemFound, setBrakeSystemFound] = useState([]);
  const [tractionFound, setTractionFound] = useState([]);
  const [transmitionFound, setTransmitionFound] = useState([]);
  const [propulsionFound, setPropulsionFound] = useState([]);
  const [color, setColor] = useState([]);
  const [filtredVehicles, setFiltredVehicles] = useState([]);
  const [fechaInicio, setFechaInicio] = useState([]);
  const [fechaFin, setFechaFin] = useState([]);
  const [test, setTest] = useState(undefined);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== null && value !== "" && value !== undefined
      )
    );

    axios
      .get("http://localhost:3000/api/filterVehicle", {
        params: filteredValues,
      })
      .then((response) => {
        setFiltredVehicles(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No hay vehiculos que coincidan con los datos especificados",
        });
      });
  };

  const handleModel = (id_marca) => {
    try {
      axios
        .get(`http://localhost:3000/api/model/${id_marca}`)
        .then((response) => {
          console.log(response.data);
          setModel(response.data);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/vehicle");
        const data = await response.json();
        setvehicleFound(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/api/brand").then((response) => {
      setBrand(response.data);
      // console.log(vehicleFound);
    });
    axios.get("http://localhost:3000/api/brakeSystem").then((response) => {
      setBrakeSystemFound(response.data);
    });

    axios.get("http://localhost:3000/api/traction").then((response) => {
      setTractionFound(response.data);
    });

    axios.get("http://localhost:3000/api/transmition").then((response) => {
      setTransmitionFound(response.data);
    });

    axios.get("http://localhost:3000/api/propulsion").then((response) => {
      setPropulsionFound(response.data);
    });
    axios.get("http://localhost:3000/api/colors").then((response) => {
      setColor(response.data);
    });
  }, []);

  return test !== undefined ? (
    <OnlineReservation vehicle={test} setTest={setTest} />
  ) : (
    <Formik
      initialValues={{
        id_marca: null,
        id_modelo: null,
        anio: null,
        anio_hasta: null,
        precio: null,
        precio_hasta: null,
        id_traccion: null,
        id_color: null,
        id_tipo_transmision: null,
        fechaInicio: "",
        fechaFin: "",
      }}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        // console.log(values);
        // resetForm();
      }}
    >
      {({ handleChange, setFieldValue, values, setValues }) => (
        <section className="sectionFatherVehicle">
          <div className="sectionFatherInside">
            <Form>
              <div className="barraFiltro">
                <div className="topPart">
                <GoBackButton
                style={{
                  position: "relative",
                  bottom: "21px"
                }}
                  onclick={() => {
                    navigate("/");
                  }}
                />
                  <p>¡Busca tu vehiculo!</p>
                </div>
                <div className="searhCar">
                  <div className="esp">
                    <div className="field">
                      <label className="label">Fecha Inicio</label>
                      <div className="control">
                        <Field
                          className="input"
                          type="date"
                          name="fechaInicio"
                          value={values.fechaInicio}
                          onChange={(e) => {
                            setFieldValue("fechaInicio", e.target.value);
                            setFechaInicio(e.target.value);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="fechaInicio"
                          component="p"
                          className="help is-danger"
                        ></ErrorMessage>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Fecha Fin</label>
                      <div className="control">
                        <Field
                          className="input"
                          type="date"
                          name="fechaFin"
                          value={values.fechaFin}
                          onChange={(e) => {
                            setFechaFin(e.target.value);
                            setFieldValue("fechaFin", e.target.value);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="fechaFin"
                          component="p"
                          className="help is-danger"
                        ></ErrorMessage>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Marca</label>
                      <div className="control">
                        <Select
                          options={brand.map((brandd) => ({
                            value: brandd.id_marca,
                            label: brandd.marca,
                          }))}
                          isClearable
                          isSearchable
                          placeholder="Seleccione el tipo"
                          name="id_marca"
                          value={
                            values.id_marca
                              ? {
                                  value: values.id_marca,
                                  label:
                                    brand.find(
                                      (item) =>
                                        item.id_marca === values.id_marca
                                    )?.marca || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption.value) {
                              setFieldValue("id_marca", selectedOption?.value);
                              handleModel(selectedOption.value);
                              // handleSelectChange(selectedOption, 0);
                            } else {
                              setFieldValue("id_marca", "");
                            }
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
                      <label className="label">Modelo</label>
                      <div className="control">
                        <Select
                          options={model.map((model) => ({
                            value: model.id_modelo,
                            label: model.modelo,
                          }))}
                          isClearable
                          isSearchable
                          placeholder="Seleccione el Modelo"
                          name="id_modelo"
                          value={
                            values.id_modelo
                              ? {
                                  value: values.id_modelo,
                                  label:
                                    model.find(
                                      (item) =>
                                        item.id_modelo === values.id_modelo
                                    )?.modelo || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption.value) {
                              setFieldValue("id_modelo", selectedOption?.value);
                              // handleSelectChange(selectedOption, 0);
                            } else {
                              setFieldValue("id_modelo", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="id_modelo"
                          component="p"
                          className="help is-danger"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Traccion:</label>
                      <div className="control">
                        <Select
                          options={tractionFound.map((traccion) => ({
                            value: traccion.id_traccion,
                            label: traccion.traccion,
                          }))}
                          isClearable
                          isSearchable
                          placeholder="Seleccione el tipo"
                          name="id_traccion"
                          value={
                            values.id_traccion
                              ? {
                                  value: values.id_traccion,
                                  label:
                                    tractionFound.find(
                                      (item) =>
                                        item.id_traccion === values.id_traccion
                                    )?.traccion || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption.value) {
                              setFieldValue(
                                "id_traccion",
                                selectedOption?.value
                              );
                              // handleSelectChange(selectedOption, 0);
                            } else {
                              setFieldValue("id_traccion", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="id_traccion"
                          component="p"
                          className="help is-danger"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Transmision:</label>
                      <div className="control">
                        <Select
                          options={transmitionFound.map((transmision) => ({
                            value: transmision.id_tipo_transmision,
                            label: transmision.tipo,
                          }))}
                          // className="select"
                          isClearable
                          isSearchable
                          name="id_tipo_transmision"
                          placeholder="Seleccione el tipo"
                          value={
                            values.id_tipo_transmision
                              ? {
                                  value: values.id_tipo_transmision,
                                  label:
                                    transmitionFound.find(
                                      (item) =>
                                        item.id_tipo_transmision ===
                                        values.id_tipo_transmision
                                    )?.tipo || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption.value) {
                              setFieldValue(
                                "id_tipo_transmision",
                                selectedOption?.value
                              );
                              // handleSelectChange(selectedOption, 0);
                            } else {
                              setFieldValue("id_tipo_transmision", "");
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Color</label>
                      <div className="control">
                        <Select
                          options={color.map((item) => ({
                            value: item.id_color,
                            label: item.color,
                          }))}
                          placeholder="Seleccione el color"
                          isClearable
                          isSearchable
                          name="id_color"
                          value={
                            values.id_color
                              ? {
                                  value: values.id_color,
                                  label:
                                    color.find(
                                      (item) =>
                                        item.id_color === values.id_color
                                    )?.color || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            setFieldValue(
                              "id_color",
                              selectedOption?.value || ""
                            );
                          }}
                        />
                        <ErrorMessage
                          name="id_color"
                          component="p"
                          className="help is-danger"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Precio:</label>
                      <div className="control">
                        <Select
                          type="select"
                          // className="select"
                          name=""
                          id=""
                        />
                        <p>Hasta:</p>
                        <Select
                          type="number"
                          // className="select"
                          name=""
                          id=""
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Año:</label>
                      <div className="control">
                        <Select
                          type="number"
                          // className="input"
                          name="anio"
                          id=""
                        />
                        <p>Hasta:</p>
                        <Select
                          type="number"
                          // className="input"
                          name="anio_hasta"
                          id=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="buttonsearch">
                    <button type="submit">Buscar</button>
                  </div>
                </div>
              </div>
            </Form>
            <div className="vehiculos">
              <div className="vehiculosInside">
                {filtredVehicles && filtredVehicles.length > 0
                  ? filtredVehicles.map((vehicle) => (
                      <DinamicVehicle
                        key={vehicle.id_vehiculo}
                        image={vehicle.imagen_url}
                        name={vehicle.marca}
                        modelo={vehicle.modelo}
                        version={vehicle.veersion}
                        vehicle={vehicle}
                        onViewOffer={setTest}
                        passengers={vehicle.capacidadPersonas}
                        year={vehicle.año}
                        price={`${vehicle.precio} US`}
                      />
                    ))
                  : vehicleFound.map((vehicle) => (
                      <DinamicVehicle
                        key={vehicle.id_vehiculo}
                        image={vehicle.imagen_url}
                        name={vehicle.marca}
                        modelo={vehicle.modelo}
                        version={vehicle.veersion}
                        vehicle={vehicle}
                        onViewOffer={setTest}
                        passengers={vehicle.capacidadPersonas}
                        year={vehicle.año}
                        price={`${vehicle.precio} DOP`}
                      />
                    ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </Formik>
  );
}
