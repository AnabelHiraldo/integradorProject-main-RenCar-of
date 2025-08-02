import { validate } from "../../validations/vehicles.js";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import "./style.css";
import DinamicVehicle from "../DinamicVehicle/dinamicVehicle.jsx";
import { useEffect, useState } from "react";
import Select from "react-select";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
export default function FormVehicles() {
  const [color, setColor] = useState([]);
  const [status, setStatus] = useState([]);
  const [vehicleSearch, setVehicleSearch] = useState([]);
  const [isEditing, setisEditing] = useState(false);
  const [brakeSystemFound, setBrakeSystemFound] = useState([]);
  const [tractionFound, setTractionFound] = useState([]);
  const [transmitionFound, setTransmitionFound] = useState([]);
  const [propulsionFound, setPropulsionFound] = useState([]);
  const [search, setSearch] = useState("");
  const [values, setValues] = useState("");
  const [category, setCategory] = useState([]);
  const [model, setModel] = useState([]);
  const [version, setVersion] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [brand, setBrand] = useState([]);
  const [vehicleFound, setvehicleFound] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [accesoryFoundVehicle, setAccesoryFoundVehicle] = useState([]);
  const [propietarioData, setPropietarioData] = useState([]);
  const [acuerdo, SetAcuerdo] = useState([]);
  const [openModalFiles, setOpenModalFiles] = useState(false);
  const [tipoArchivo, setTipoArchivo] = useState([]);
  const [arrayArchivos, setArrayArchivos] = useState([]);
  const [filesSeleccionado, setFilesSeleccionado] = useState({
    id_tipo_archivo: null,
    ruta_archivo: null,
  });

  const navigate = useNavigate();

  const handlePropietarioAcuerdo = (selectedOption) => {
    const id_propietario = selectedOption.value;
    console.log(id_propietario);

    try {
      axios
        .get(`http://localhost:3000/api/acuerdo/${id_propietario}`)
        .then((response) => {
          SetAcuerdo(response.data);
          console.log(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/accesory").then((response) => {
      if (response.data) {
        setAccessories(response.data);
      } else {
        setAccessories([]);
      }
    });

    axios.get("http://localhost:3000/api/tipoArchivo").then((response) => {
      if (response.data) {
        setTipoArchivo(response.data);
      } else {
        setTipoArchivo([]);
      }
    });
  }, []);

  const handleAccessoryChange = (e, accessoryId) => {
    if (e.target.checked) {
      setSelectedAccessories((prevSelected) => [...prevSelected, accessoryId]);
    } else {
      setSelectedAccessories((prevSelected) =>
        prevSelected.filter((id) => id !== accessoryId)
      );
    }
  };

  const handleSubmit = async (values) => {
    let formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key !== "imagen" && key !== "archivos") {
        formData.append(key, values[key] || "");
      }
    });

    if (values.imagen) {
      formData.append("imagen", values.imagen);
    }

    formData.append(
      "accesorios",
      JSON.stringify(selectedAccessories.length > 0 ? selectedAccessories : [])
    );

  if (arrayArchivos.length > 0) {
    arrayArchivos.forEach((archivo, index) => {
      formData.append(`ruta_archivo`, archivo.ruta_archivo);
      formData.append(
        `ruta_archivo[${index}]`,
        archivo.id_tipo_archivo.value
      ); // Tipo de archivo relacionado
    });
  }

  // console.log(arrayArchivos)

    for (let pair of formData.entries()) {
      console.log(`Key: ${pair[0]}, Value: ${pair[1]}`);
    }

    console.log(formData);
     try {
       const url = `http://localhost:3000/api/${
         !isEditing ? "vehicle" : `vehicle/${vehicleSearch}`
       }`;

       const method = !isEditing ? "post" : "put";

     const response = await axios({
         method,
         url,
         data: formData,
         headers: {
           "Content-Type": "multipart/form-data",
         },
       });

       console.log(response.data);
       //  setSelectedAccessories([]);
     } catch (error) {
       console.error("Error al enviar los datos:", error);
     }
  };

  const [miArreglo, setMiArreglo] = useState([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  const handleSelectChange = (selectedOption, index) => {
    if (!selectedOption) {
      console.error("selectedOption es null o undefined");
      return;
    }
    setMiArreglo((prevArreglo) => {
      const newArreglo = [...prevArreglo];
      newArreglo[0] = selectedOption.value;
      newArreglo[1] = selectedOption.value;
      newArreglo[2] = selectedOption.value;
      newArreglo[3] = selectedOption.email;

      return newArreglo;
    });
  };
  const handleModel = (id_marca) => {
    axios
      .get(`http://localhost:3000/api/model/${id_marca}`)
      .then((response) => {
        response.data ? setModel(response.data) : "";
      });
  };

  const handleVersion = (id_version) => {
    axios
      .get(`http://localhost:3000/api/version/${id_version}`)
      .then((response) => {
        response.data ? setVersion(response.data) : "";
      });
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
  axios.get("http://localhost:3000/api/propietario/all").then((response) => {
    setPropietarioData(response.data);
    // console.log(vehicleFound);
  });

  useEffect(() => {
    axios.get("http://localhost:3000/api/propietario/all").then((response) => {
      setPropietarioData(response.data);
      // console.log(vehicleFound);
    });

    axios.get("http://localhost:3000/api/status").then((response) => {
      setStatus(response.data);
    });

    axios.get("http://localhost:3000/api/colors").then((response) => {
      setColor(response.data);
    });

    axios.get("http://localhost:3000/api/brand").then((response) => {
      setBrand(response.data);
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
  }, []);

  function searchVehicle(setFormikValues) {
    console.log(vehicleSearch);
    axios
      .get(`http://localhost:3000/api/vehicle/${vehicleSearch}`)
      .then((response) => {
        setisEditing(true);
        // setshowColor(response.data.color);
        setFormikValues({
          matricula: response.data.matricula,
          numChasis: response.data.numChasis,
          placa: response.data.placa,
          id_veersion: response.data.id_veersion,
          año: response.data.año,
          numPuertas: response.data.numPuertas,
          capacidadPersonas: response.data.capacidadPersonas,
          imagen: response.data.imagen_url,
          precio: response.data.precio,
          kilometraje_actual: response.data.kilometraje_actual,
          capacidad_combustible: response.data.capacidad_combustible,
          capacidad_carga_peso: response.data.capacidad_carga_peso,
          id_color: response.data.id_color,
          id_sistema_freno: response.data.id_sistema_freno,
          id_traccion: response.data.id_traccion,
          id_tipoPropulsion: response.data.id_tipoPropulsion,
          id_tipo_transmision: response.data.id_tipo_transmision,
          id_estado_a_i: response.data.id_estado_a_i,
          // setSelectedAccessories: response.data.id_accesorio
        });

        const result = response.data;
        const accesorioss = result.accesorios
          ? result.accesorios.split(",")
          : [];
        const ResultAccesory = accesorioss.map(Number);
        setSelectedAccessories(ResultAccesory);
        setAccesoryFoundVehicle(ResultAccesory);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          // Swal.fire({
          //   icon: "error",
          //   title: "Oops...",
          //   text: "No se encontraron datos!",
          // });
        }
      });
  }

  return (
    <section className="sectionVehicle1">
      <header>
        <h1>Formulario de Vehiculos</h1>
      </header>
      <Formik
        initialValues={{
          matricula: "",
          numChasis: "",
          placa: "",
          id_veersion: "",
          año: "",
          numPuertas: "",
          capacidadPersonas: "",
          imagen: null,
          precio: "",
          kilometraje_actual: "",
          capacidad_combustible: "",
          capacidad_carga_peso: "",
          id_color: "",
          id_sistema_freno: "",
          id_traccion: "",
          id_tipoPropulsion: "",
          id_tipo_transmision: "",
          id_estado_a_i: "",
          accesorios: [],
          propio: "",
          id_acuerdo: "",
          id_propietario: "",
          ruta_archivo: null,
        }}
        // validate={validate}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
          setisEditing(false);
          // document.querySelector("input[type='file']").value = "";
        }}
      >
        {({ handleChange, setValues, setFieldValue, values }) => (
          <Form>
            <div className="group">
              <div className="field">
                <label className="label">Buscar Vehiculo</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="searchClient"
                    value={vehicleSearch}
                    placeholder="Ingrese los datos del cliente"
                    onChange={(e) => {
                      handleChange(e);
                      setVehicleSearch(e.target.value);
                    }}
                  ></Field>
                  <ErrorMessage
                    name="searchClient"
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
                    <option value="email">ID</option>
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
                      searchVehicle(setValues);
                    }}
                  >
                    Buscar Vehiculo
                  </button>
                </div>
              </div>
            </div>
            <div className="group_Propietario">
              <div className="field">
                <label className="label">Propiedad</label>
                <div className="control">
                  <Select
                    options={[
                      { value: 0, label: "Propio" },
                      { value: 1, label: "Externo" },
                    ]}
                    placeholder="Seleccione una opción"
                    name="propio"
                    isClearable
                    isSearchable
                    value={
                      values.propio !== undefined
                        ? {
                            value: values.propio,
                            label: values.propio === 1 ? "Externo" : "Propio",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue("propio", selectedOption?.value || 0);
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

            {values.propio === 1 && (
              <div className="group_acuerdo">
                <div
                  className="field"
                  style={{
                    width: "30%",
                    marginRight: "5px",
                  }}
                >
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
                                    item.id_propietario ===
                                    values.id_propietario
                                )?.nombre || "",
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "id_propietario",
                          selectedOption?.value || ""
                        );
                        handlePropietarioAcuerdo(selectedOption);

                        //Hay que arreglar esta parte de aqui para que no se ejecute si esta vacio
                        // handleModel(selectedOption.value);
                        // handleSelectChange(selectedOption, 0);
                      }}
                    />
                    <ErrorMessage
                      name="id_propietario"
                      component="p"
                      className="help is-danger"
                    />
                  </div>
                </div>
                <div
                  className="field"
                  style={{
                    width: "70%",
                  }}
                >
                  <label className="label">Seleccione un acuerdo</label>
                  <div className="control">
                    <Select
                      options={acuerdo.map((item) => ({
                        value: item.id_acuerdo,
                        label: `Tipo de acuerdo: ${item.nombre_tipo_acuerdo},     Valor: ${item.valor_comision_tarifa},   Plazo de pago: ${item.plazo_pago}`,
                      }))}
                      placeholder="Seleccione un acuerdo"
                      isClearable
                      isSearchable
                      name="id_acuerdo"
                      value={
                        values.id_acuerdo
                          ? acuerdo.find(
                              (item) => item.id_acuerdo === values.id_acuerdo
                            ) && {
                              value: values.id_acuerdo,
                              label: `Tipo de acuerdo: ${
                                acuerdo.find(
                                  (item) =>
                                    item.id_acuerdo === values.id_acuerdo
                                )?.nombre_tipo_acuerdo || ""
                              }, Valor: ${
                                acuerdo.find(
                                  (item) =>
                                    item.id_acuerdo === values.id_acuerdo
                                )?.valor_comision_tarifa || ""
                              }, Plazo de pago: ${
                                acuerdo.find(
                                  (item) =>
                                    item.id_acuerdo === values.id_acuerdo
                                )?.plazo_pago || ""
                              }`,
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "id_acuerdo",
                          selectedOption?.value || ""
                        );
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
            )}

            {/* d */}

            <div className="group">
              <div className="field">
                <label className="label">Matrícula</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="matricula"
                    placeholder="Matrícula"
                  />
                  <ErrorMessage
                    name="matricula"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Numero De Chasis</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="numChasis"
                    placeholder="Ingrese el numero de chasis"
                  />
                  <ErrorMessage
                    name="numChasis"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Año</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="año"
                    placeholder="Año"
                  />
                  <ErrorMessage
                    name="año"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Precio</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="precio"
                    placeholder="Precio"
                  />
                  <ErrorMessage
                    name="precio"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <div className="field">
                <label className="label">Número de puertas</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="numPuertas"
                    placeholder="Número de puertas"
                  />
                  <ErrorMessage
                    name="numPuertas"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Capacidad de personas</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="capacidadPersonas"
                    placeholder="Capacidad de personas"
                  />
                  <ErrorMessage
                    name="capacidadPersonas"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Imagen</label>
                <div className="control">
                  <input
                    className="input"
                    type="file"
                    name="imagen"
                    onChange={(e) => {
                      const imagenSelected = e.target.files[0];
                      console.log("Imagen seleccionada:", imagenSelected); // Confirmar el archivo seleccionado
                      setFieldValue("imagen", imagenSelected); // Almacenar el archivo en el estado de Formik
                    }}
                  />
                  <ErrorMessage
                    name="imagen"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <div className="group">
              <div className="field">
                <label className="label">Marca</label>
                <div className="control">
                  <Select
                    options={brand.map((brandd) => ({
                      value: brandd.id_marca,
                      label: brandd.marca,
                    }))}
                    placeholder="Seleccione el tipo"
                    isClearable
                    isSearchable
                    name="id_marca"
                    value={
                      values.id_marca
                        ? {
                            value: values.id_marca,
                            label:
                              brand.find(
                                (item) => item.id_marca === values.id_marca
                              )?.marca || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue("id_marca", selectedOption?.value || "");
                      //Hay que arreglar esta parte de aqui para que no se ejecute si esta vacio
                      handleModel(selectedOption.value);
                      handleSelectChange(selectedOption, 0);
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
                    options={model.map((item) => ({
                      value: item.id_modelo,
                      label: item.modelo,
                    }))}
                    placeholder="Seleccione el tipo"
                    isClearable
                    isSearchable
                    name="id_modelo"
                    value={
                      values.id_modelo
                        ? {
                            value: values.id_modelo,
                            label:
                              model.find(
                                (item) => item.id_modelo === values.id_modelo
                              )?.modelo || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue("id_modelo", selectedOption?.value || "");
                      handleVersion(selectedOption.value);
                      // miArreglo[1] = selectedOption.value;
                      handleSelectChange(selectedOption, 1);
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
                <label className="label">Version</label>
                <div className="control">
                  <Select
                    options={version.map((item) => ({
                      value: item.id_veersion,
                      label: item.veersion,
                    }))}
                    placeholder="Seleccione el tipo"
                    isClearable
                    isSearchable
                    name="id_veersion"
                    value={
                      values.id_veersion
                        ? {
                            value: values.id_veersion,
                            label:
                              version.find(
                                (item) =>
                                  item.id_veersion === values.id_veersion
                              )?.veersion || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue("id_veersion", selectedOption?.value || "");
                      //  miArreglo[2] = selectedOption.value;
                      // handleSelectChange(selectedOption, 2);
                    }}
                  />
                  <ErrorMessage
                    name="id_veersion"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <div className="group">
              <div className="field">
                <label className="label">Kilometraje actual</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="kilometraje_actual"
                    placeholder="Ingrese la cantidad de kilometros actual"
                  />
                  <ErrorMessage
                    name="kilometraje_actual"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Capacidad de combustible</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="capacidad_combustible"
                    placeholder="Litros/Galones"
                  />
                  <ErrorMessage
                    name="capacidad_combustible"
                    component="p"
                    className="help is-danger"
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
                                (item) => item.id_color === values.id_color
                              )?.color || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue("id_color", selectedOption?.value || "");
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
                <label className="label">Placa</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="placa"
                    placeholder="Placa"
                  />
                  <ErrorMessage
                    name="placa"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <div className="group">
              <div className="field">
                <div className="control">
                  <button
                    type="button"
                    className="button"
                    onClick={() => setOpenModalFiles(true)}
                  >
                    Cargar Archivos
                  </button>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button
                    type="button"
                    className="button"
                    onClick={() => setModalIsOpen(true)}
                  >
                    Añadir Accesorios
                  </button>
                </div>
              </div>
              <div className="field">
                <label className="label">Capacidad de Carga</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    name="capacidad_carga_peso"
                    placeholder="Capacidad de carga del vehiculo"
                  />
                  <ErrorMessage
                    name="capacidad_carga_peso"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>
            <div className="group">
              <div className="field">
                <label className="label">Sistema de frenos</label>
                <div className="control">
                  <Field
                    as="select"
                    name="id_sistema_freno"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Seleccione el sistema de frenos</option>
                    {brakeSystemFound.map((brake) => (
                      <option
                        key={brake.id_sistema_freno}
                        value={brake.id_sistema_freno}
                      >
                        {brake.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="id_sistema_freno"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Traccion</label>
                <div className="control">
                  <Field
                    className="select"
                    as="select"
                    name="id_traccion"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Selecciona la Traccion</option>
                    {tractionFound.map((traction) => (
                      <option
                        key={traction.id_traccion}
                        value={traction.id_traccion}
                      >
                        {traction.traccion}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="id_traccion"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Propulsion</label>
                <div className="control">
                  <Field
                    as="select"
                    name="id_tipoPropulsion"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">
                      Seleccione el sistema de Propulsion
                    </option>
                    {propulsionFound.map((propulsion) => (
                      <option
                        key={propulsion.id_tipoPropulsion}
                        value={propulsion.id_tipoPropulsion}
                      >
                        {propulsion.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="id_tipoPropulsion"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Transmision</label>
                <div className="control">
                  <Field
                    as="select"
                    name="id_tipo_transmision"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Seleccione la transmision</option>
                    {transmitionFound.map((transmition) => (
                      <option
                        key={transmition.id_tipo_transmision}
                        value={transmition.id_tipo_transmision}
                      >
                        {transmition.tipo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="id_tipo_transmision"
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
            </div>
            {/* Modal para seleccionar accesorios */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              className="ReactModal__Content"
              overlayClassName="ReactModal__Overlay"
            >
              <div className="modalFather">
                <div className="modal-contentt">
                  <h2>Seleccionar Accesorios</h2>
                  <div className="accessories-list">
                    {accessories.map((accessory) => (
                      <div
                        key={accessory.id_accesorio}
                        className="accessory-item"
                      >
                        <label>
                          <input
                            type="checkbox"
                            value={accessory.id_accesorio}
                            onChange={(e) =>
                              handleAccessoryChange(e, accessory.id_accesorio)
                            }
                            checked={selectedAccessories.includes(
                              accessory.id_accesorio
                            )}
                          />
                          {accessory.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="buttonActionModal">
                  <button
                    className="button-cerrar"
                    onClick={() => {
                      setModalIsOpen(false);
                      isEditing
                        ? setSelectedAccessories[accesoryFoundVehicle]
                        : setSelectedAccessories([]);
                    }}
                  >
                    Cerrar
                  </button>
                  <button
                    className="button-guardar"
                    onClick={() => {
                      console.log(selectedAccessories);
                      setModalIsOpen(false);
                      // setSelectedAccessories([]);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </Modal>
            {/* Modal para cargar archivos */}

            <Modal
              isOpen={openModalFiles}
              onRequestClose={() => setOpenModalFiles(false)}
              contentLabel="Formulario de Archivos"
              className="custommodalFiles"
              overlayClassName="customoverlayFiles"
            >
              <div className="contentModalFiles">
                <h2>Cargar Archivos</h2>

                <div className="group">
                  {/* Campo para la Parte Afectada */}
                  <div className="field">
                    <div className="control">
                      <label htmlFor="tipoArchivo">Tipo de Archivo:</label>
                      <Select
                        options={tipoArchivo.map((item) => ({
                          value: item.id_tipo_archivo,
                          label: item.nombre,
                        }))}
                        id="tipoArchivo"
                        isSearchable
                        isClearable
                        required
                        value={filesSeleccionado.id_tipo_archivo}
                        onChange={(selectedOption) =>
                          setFilesSeleccionado((prev) => ({
                            ...prev,
                            id_tipo_archivo: selectedOption,
                          }))
                        }
                      ></Select>
                    </div>
                  </div>
                </div>
                <div className="group">
                  {/* Campo para la Imagen */}
                  <div className="field">
                    <label className="label">Imagen</label>
                    <div className="control">
                      <input
                        id="archivo"
                        type="file"
                        accept="image/*,application/pdf"
                        name="ruta_archivo"
                        required
                        onChange={(e) => {
                          const file = e.target.files[0];
                          console.log("Archivo seleccionado:", file); // Asegúrate de que este log muestra el archivo correctamente
                          setFilesSeleccionado((prev) => ({
                            ...prev,
                            ruta_archivo: file,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="field">
                    <div className="control">
                      <button
                        type="button"
                        className="button-guardar"
                        onClick={() => {
                          if (
                            !filesSeleccionado
                            //  ||
                            // !currentDamage.id_parte ||
                            // !currentDamage.id_tipo_daño
                          ) {
                            alert(
                              "Debe seleccionar un vehículo, la parte afectada y el tipo de daño."
                            );
                            return;
                          }
                          setArrayArchivos((prev) => [
                            ...prev,
                            {
                              ...filesSeleccionado,
                            },
                          ]);
                          setFilesSeleccionado({
                            id_tipo_archivo: "",
                            ruta_archivo: null,
                          });
                        }}
                      >
                        Añadir Archivo
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tableDetails">
                  <table>
                    <thead>
                      <tr>
                        <th>tipo de archivo</th>
                        <th>Archivo</th>
                        <th>Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arrayArchivos.map((damage, index) => (
                        <tr key={index}>
                          <td>{damage.id_tipo_archivo?.label}</td>
                          <td>
                            {damage.ruta_archivo && (
                              <>
                                {damage.ruta_archivo.type.startsWith(
                                  "image/"
                                ) ? (
                                  // Renderiza imágenes
                                  <img
                                    src={URL.createObjectURL(
                                      damage.ruta_archivo
                                    )}
                                    alt="Archivo"
                                    style={{
                                      width: "150px",
                                      height: "auto",
                                    }}
                                  />
                                ) : (
                                  // Renderizar otros tipos de archivos como PDF
                                  <a
                                    href={URL.createObjectURL(
                                      damage.ruta_archivo
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      textDecoration: "underline",
                                      color: "blue",
                                    }}
                                  >
                                    Ver Archivo
                                  </a>
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                setArrayArchivos((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="buttonActionFilesModal">
                  <button
                    type="button"
                    className="btncerrar"
                    // onClick={handleSubmitArchivo}
                    onClick={() => setOpenModalFiles(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn-submit"
                    // onClick={handleSubmitArchivo}
                    onClick={() => setOpenModalFiles(false)}
                  >
                    Guardar Documento
                  </button>
                </div>
              </div>
            </Modal>

            <div className="field-is-grouped">
              <div className="control">
                <button className="button-is-primary" type="submit">
                  {!isEditing ? "Registrar Vehiculo" : "Actualizar Vehiculo"}
                </button>
              </div>
              <div className="control">
                <button className="button-is-light" type="reset">
                  cancelar
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {/* <div className="listCar">

          {vehicleFound.map((vehicle) => (
            <DinamicVehicle
              key={vehicle.id_vehiculo}
              image={vehicle.imagen_url} 
              name={vehicle.marca}
              modelo = {vehicle.modelo}
              version = {vehicle.veersion}
              passengers = {vehicle.capacidadPersonas}
              year={vehicle.año}
              price={`${vehicle.precio} US`}
            />
          
          ))}
          {vehicleFound.map((vehicle) => (
           console.log(vehicle.imagen_url)
          
          ))}
      
      </div> */}
    </section>
  );
}
