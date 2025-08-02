import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import "./styleRents.css";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import Notification from "../Notificacion/notificacion";
import Modal from "react-modal";
import { format } from "date-fns";
import DinamicVehicle from "../DinamicVehicle/dinamicVehicle";
import ViewOfertVehicle from "../ViewOfertVehicle/ViewOfertVehicle";
// const [ menuStatus, setMenuStatus ] = useState(false);

//   const handleMenuChange = (status) => {
//     setMenuStatus(status);
//   }

export default function FormRents() {
  const [status, setStatus] = useState([]);
  const [vehicleFound, setvehicleFound] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [model, setModel] = useState([]);
  const [version, setVersion] = useState([]);
  const [vehiclePosition, setVehiclePosition] = useState([]);
  const [arrayDetalleReserva, setArrayDetalleReserva] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [email, setEmail] = useState([]);
  const [miArrayData, setMyArrayData] = useState([]);
  const [modal, setModal] = useState(false);
  const [ofert, setOfert] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [daysCalculo, setDayCalculos] = useState("");
  const [mountTotal, setMountTotal] = useState("");
  const [arrayEmailData, setArrayEmailData] = useState([]);
  const [clientName, setClientName] = useState("");
  const [totalrent, setTotalRent] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [configData, setConfigData] = useState([]);
  const [getIdEntidad, setGetIdEntidad] = useState([]);
  const [getDireccion, setGetDireccion] = useState([]);
  const [envioVehiculo, setEnvioVehiculo] = useState(false);
  const [notification, setNotification] = useState(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState({});

  const [recogidaVehiculo, setRecogidaVehiculo] = useState(true);
  const [isDireccionPropia, setisDireccionPropia] = useState(false);
  const [isLugarComun, setIsLugarComun] = useState(false);

  const [lugarComun, setLugarComun] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoMoneda, setTipoMoneda] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/lugarComun").then((response) => {
      setLugarComun(response.data);
    });

    axios.get("http://localhost:3000/api/tipoMoneda").then((response) => {
      setTipoMoneda(response.data);
    });

    axios.get("http://localhost:3000/api/paymentMethod").then((response) => {
      setPaymentMethod(response.data);
    });
  }, []);

  const handleDireccionChange = (vehicleId, tipoDireccion, selectedOption) => {
    setDireccionSeleccionada((prev) => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [tipoDireccion]: selectedOption,
      },
    }));
  };

  const renderDireccionSelect = (vehicle, tipoDireccion) => {
    if (!envioVehiculo) {
      return null;
    }

    if (envioVehiculo && isDireccionPropia) {
      return (
        <td>
          <Select
            options={getDireccion.map((dir, index) => ({
              key: index,
              value: dir.id_direccion,
              label: `${dir.calle}, ${dir.descripcion_lugar}, ${dir.ciudad}`,
              calle: dir.calle,
              descripcion_lugar: dir.descripcion_lugar,
              ciudad: dir.ciudad,
            }))}
            placeholder="Seleccione la dirección"
            name={`direccion_${tipoDireccion}_${vehicle.id_vehiculo}`}
            isClearable
            isSearchable
            value={
              direccionSeleccionada[vehicle.id_vehiculo]?.[tipoDireccion] ||
              null
            }
            onChange={(selectedOption) =>
              handleDireccionChange(
                vehicle.id_vehiculo,
                tipoDireccion,
                selectedOption
              )
            }
          />
        </td>
      );
    }

    if (envioVehiculo && !isDireccionPropia && isLugarComun) {
      return (
        <td>
          <Select
            options={lugarComun.map((lc) => ({
              value: lc.id_lugar,
              label: `${lc.nombre}, ${lc.calle}, ${lc.ciudad}`,
              calle: lc.calle,
              ciudad: lc.ciudad,
            }))}
            placeholder="Seleccione la dirección"
            name={`direccion_${tipoDireccion}_${vehicle.id_vehiculo}`}
            isClearable
            isSearchable
            value={
              direccionSeleccionada[vehicle.id_vehiculo]?.[tipoDireccion] ||
              null
            }
            onChange={(selectedOption) =>
              handleDireccionChange(
                vehicle.id_vehiculo,
                tipoDireccion,
                selectedOption
              )
            }
          />
        </td>
      );
    }

    // Entrada Manual de Dirección
    return (
      <td>
        <input
          type="text"
          placeholder="Ingrese dirección manualmente"
          value={
            direccionSeleccionada[vehicle.id_vehiculo]?.[tipoDireccion]
              ?.label || ""
          }
          onChange={(e) =>
            handleDireccionChange(vehicle.id_vehiculo, tipoDireccion, {
              value: e.target.value,
              label: e.target.value,
            })
          }
        />
      </td>
    );
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
      newArreglo[index] = selectedOption.value;
      setEmail(selectedOption.email);
      setClientName(selectedOption.label);
      setTotalRent(selectedOption.total_rentas);
      setGetIdEntidad(selectedOption.id_entidad);
      return newArreglo;
    });
  };

  const handleModel = (id_marca) => {
    axios
      .get(`http://localhost:3000/api/model/${id_marca}`)
      .then((response) => {
        response.data ? setModel(response.data) : "";
        // console.log(response.data);
      });
  };

  const handleVersion = (id_version) => {
    axios
      .get(`http://localhost:3000/api/version/${id_version}`)
      .then((response) => {
        response.data ? setVersion(response.data) : "";
        // console.log(response.data);
      });
  };

  const handleVehicle = (id_marca, id_modelo, id_version, fecha) => {
    if (!id_marca || !id_modelo || !id_version || !fecha) {
      console.error("Faltan parámetros:", {
        id_marca,
        id_modelo,
        id_version,
        fecha,
      });
      return;
    }

    console.log("ID Marca:", id_marca);
    console.log("ID Modelo:", id_modelo);
    console.log("ID Versión:", id_version);
    console.log("Fecha Inico:", fecha);

    axios
      .get(
        `http://localhost:3000/api/vehicle/${id_marca}/${id_modelo}/${id_version}/${fecha}`
      )
      .then((response) => {
        if (response.data) {
          setvehicleFound(response.data);
        } else {
          Swal.fire({
            title: "RentEasy Alert",
            text: "No se encontro ningun vehiculo",
            icon: "info",
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No hay vehiculos disponibles con los datos especificados",
          });
        }
      });
  };

  const handleEmail = (emaill, text) => {
    if (!emaill || !text) {
      console.error("Faltan parámetros:", { emaill, text });
      return;
    }

    console.log(emaill);
    console.log(text);

    axios
      .post("http://localhost:3000/api/email", { emaill, text })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  };

  function handlevisible() {
    setIsModalVisible(!isModalVisible);
  }

  function handleModal() {
    setModal(!modal);
  }

  // function handleSelected() {
  //   setIsSelected(!isSelected);
  // }

  const closeModal = () => setModal(false);

  const handleVehicleSelected = (
    vehicle,
    total,
    fechaInicio,
    fechaFin,
    setFieldValue
  ) => {
    let direccion = [];

    // Verifico si hay una dirección seleccionada para el vehículo
    if (direccionSeleccionada[vehicle.id_vehiculo]) {
      direccion = [...direccion, direccionSeleccionada[vehicle.id_vehiculo]];
    }

    const valEnt =
      direccion[0]?.entrega?.value || direccion[0]?.recogida?.value;
    const valRec =
      direccion[0]?.recogida?.value || direccion[0]?.entrega?.value;
    // Si el envío del vehículo está habilitado, verifico si la dirección está definida
    if (envioVehiculo === true) {
      if (!direccion) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debe seleccionar una dirección antes de continuar.",
        });
        return;
      }
    }

    setArrayDetalleReserva((prev) => {
      const isSelected = prev.some(
        (detalle) => detalle.id_vehiculo === vehicle.id_vehiculo
      );

      const updatedArray = isSelected
        ? prev.filter((detalle) => detalle.id_vehiculo !== vehicle.id_vehiculo)
        : [
            ...prev,
            {
              ...vehicle,
              total,
              fechaInicio,
              fechaFin,
              ...(envioVehiculo
                ? {
                    entrega: valEnt,
                    recogida: valRec,
                    direccion: isDireccionPropia
                      ? "Propia"
                      : isLugarComun
                      ? "Comun"
                      : "Manual",
                  }
                : {}),
            },
          ];

      const totalInventario = updatedArray.reduce(
        (total, auto) => total + auto.total,
        0
      );

      setFieldValue("total", totalInventario);

      return updatedArray;
    });
  };

  useEffect(() => {
    // axios.get("http://localhost:3000/api/vehicle").then((response) => {
    //   setvehicleFound(response.data);
    //   // console.log(vehicleFound);
    // });
    axios.get("http://localhost:3000/api/clients").then((response) => {
      setClientData(response.data);
      // console.log(vehicleFound);
    });

    axios.get("http://localhost:3000/api/brand").then((response) => {
      setBrand(response.data);
      // console.log(vehicleFound);
    });
    axios.get("http://localhost:3000/api/category").then((response) => {
      setCategory(response.data);
      console.log(vehicleFound);
    });

    axios.get("http://localhost:3000/api/configPuntos").then((response) => {
      setConfigData(response.data[0]);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/api/status").then((response) => {
      setStatus(response.data);
      // console.log(response.data);
    });
  }, []);

  const handleSubmit = (values) => {
    values.detalles = arrayDetalleReserva;
    console.log(values);

    try {
      axios.post("http://localhost:3000/api/rent", values).then((response) => {
        console.log(response);
        Swal.fire({
          title: "RentEasy Alert",
          text: "Renta Registrada con exito",
          icon: "success",
        });
      });
    } catch (error) {
      console.log("Error inserting data", error);
      Swal.fire({
        title: "RentEasy Alert",
        text: "Ha ocurrido un error el registrar la renta",
        icon: "error",
      });
    }

    //Esto estaba en el boton de confirmar pero lo movi para aca
    const detalleEmail = arrayDetalleReserva.map((detalle) => ({
      modelo: detalle.modelo,
      año: detalle.año,
      color: detalle.color,
      capacidadPersonas: detalle.capacidadPersonas,
      precio: detalle.precio,
      total: detalle.total,
      nombreCliente: clientName.label,
      fechaInicio: detalle.fechaInicio,
      fechaFin: detalle.fechaFin,
      // nombreCliente: values.
    }));
    //Para enviar el correo descomentar esta linea----- Lo comente porque estoy haciendo pruebas
    //  handleEmail(email.email, detalleEmail);
    setArrayDetalleReserva([]);
  };

  //--------------No me le ponga la mano a esto que me dio mucha brega jajajaaaajaj
  useEffect(() => {
    const total = arrayDetalleReserva.reduce(
      (total, auto) => total + auto.total,
      0
    );
    // setFieldValue("montoTotal", total);

    setMountTotal(total);
    // alert(total)
  }, [arrayDetalleReserva]);

  useEffect(() => {
    const detalleEmail = arrayDetalleReserva.map((detalle) => ({
      modelo: detalle.modelo,
      año: detalle.año,
      color: detalle.color,
      capacidadPersonas: detalle.capacidadPersonas,
      precio: detalle.precio,
      total: detalle.total,
    }));
    // console.log(email.email, texto)
    // console.log(detalleEmail)
  }, [JSON.stringify(arrayDetalleReserva)]);

  // hay que arreglar esto aqui, esta dando problemas
  // useEffect(() => {
  //   totalrent.total_rentas >= configData.cantRentMinima ? setIsEditable(true) : setIsEditable(false);
  // }, [totalrent]);

  // useEffect(() => {
  //   if (totalrent.total_rentas >= configData.cantRentMinima) {
  //     setIsEditable(true);
  //   } else {
  //     setIsEditable(false);
  //   }
  // }, [totalrent, configData]);

  useEffect(() => {
    console.log(totalrent);
    if (configData.id_metodo_punto === 1) {
      if (
        configData.cantRentMinima &&
        totalrent !== undefined &&
        totalrent.total_rentas >= configData.cantRentMinima
      ) {
        setIsEditable(true);
      } else {
        setIsEditable(false);
      }
    } else if (configData.id_metodo_punto === 2) {
      if (
        configData.cantRentMinima &&
        totalrent !== undefined &&
        totalrent.total_dinero >= configData.cantRentMinima
      ) {
        setIsEditable(true);
      } else {
        setIsEditable(false);
      }
    }
  }, [totalrent, configData]);

  const handledireccion = (id) => {
    console.log(id);
    axios.get(`http://localhost:3000/api/direccion/${id}`).then((response) => {
      setGetDireccion(response.data);
      console.log("Datos de direccion", response.data);
    });
  };

  return (
    <section className="sectionReservation">
      {/* Mostrar la notificación si existe */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* <div className={`contentOfert ${isModalVisible ? "visible" : "hidden"}`}>  */}
      {modal ? (
        <ViewOfertVehicle
          capacidadPersonas={miArrayData.capacidadPersonas}
          modelo={miArrayData.modelo}
          precio={miArrayData.precio}
          año={miArrayData.año}
          color={miArrayData.color}
          combustible={miArrayData.tipo_propulsion}
          transmision={miArrayData.tipo_transmision}
          traccion={miArrayData.traccion}
          onClose={closeModal}
        />
      ) : null}

      <header>
        <h1>Formulario Rentas</h1>
      </header>
      <Formik
        initialValues={{
          id_cliente: "",
          id_empleado: "",
          total: "",
          id_condicion: "",
          id_estado_a_i: 1,
          puntosCanjeados: 0,
          id_tipo_moneda: 2,
          id_metodo_pago: 2,
          detalles: [],
        }}
        //   validate={clientsValidation}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
          setArrayDetalleReserva([]);

          // handleSubmit(values /*, isEditing*/);
          //setisEditing(false);
        }}
      >
        {({ handleChange, setValues, setFieldValue, values }) => (
          <Form>
            <div className="group">
              <div className="field">
                <label className="label">Cliente</label>
                <div className="control">
                  <Select
                    options={clientData.map((cdata) => ({
                      value: cdata.id_cliente,
                      label: cdata.nombre,
                      email: cdata.email,
                      total_rentas: cdata.total_rentas || 0,
                      total_dinero: cdata.total_dinero || 0,
                      id_entidad: cdata.id_entidad || 0,
                    }))}
                    placeholder="Seleccione el cliente"
                    isClearable
                    isSearchable
                    name="id_cliente"
                    value={
                      values.id_cliente
                        ? {
                            value: values.id_cliente,
                            label:
                              clientData.find(
                                (item) => item.id_cliente === values.id_cliente
                              )?.nombre || "",
                            email:
                              clientData.find(
                                (item) => item.id_cliente === values.id_cliente
                              )?.email || "",
                            total_rentas:
                              clientData.find(
                                (dat) => dat.id_cliente === values.id_cliente
                              )?.total_rentas || "",
                            total_dinero:
                              clientData.find(
                                (dat) => dat.id_cliente === values.id_cliente
                              )?.total_dinero || "",
                            id_entidad:
                              clientData.find(
                                (id_endt) =>
                                  id_endt.id_cliente === values.id_cliente
                              )?.id_entidad || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue("id_cliente", selectedOption?.value || "");
                      handleSelectChange(selectedOption, 3);
                      setEmail(selectedOption);
                      setClientName(selectedOption);
                      setTotalRent(selectedOption);
                      handledireccion(selectedOption.id_entidad);
                    }}
                  />
                  <ErrorMessage
                    name="id_cliente"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Monto Total</label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="total"
                    placeholder="monto total"
                    readOnly
                    // value={values.mountTotal}
                    // onChange={() => {
                    // }}
                  ></Field>
                  <ErrorMessage
                    name="total"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Empleado Responsable</label>
                <div className="control">
                  <Select
                    options={{ value: 1, label: "Max" }}
                    placeholder=""
                    name="id_empleado"
                    isDisabled
                    value={{
                      value: 1,
                      label: "Maxsil Colon",
                    }}
                    onChange={(selectedOption) => {
                      setFieldValue("id_empleado", selectedOption?.value || "");
                    }}
                  />
                  <ErrorMessage
                    name="id_empleado"
                    component="p"
                    className="help is-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div className="field">
                <label className="label">Estado</label>
                <div className="control">
                  <Select
                    options={status.map((state) => ({
                      value: state.id_estado_a_i,
                      label: state.estado,
                    }))}
                    placeholder="Seleccione un estado"
                    name="id_estado_a_i"
                    isSearchable
                    isDisabled
                    defaultValue={"1"}
                    value={
                      values.id_estado_a_i
                        ? {
                            value: values.id_estado_a_i,
                            label:
                              status.find(
                                (estado) =>
                                  estado.id_estado_a_i === values.id_estado_a_i
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
            <div className="group-medio"></div>
            <div className="group">
              <div className="field">
                <label className="label">Puntos</label>
                <div className="control">
                  <Select
                    options={[{ value: 1, label: "2000" }]}
                    placeholder="Seleccione un producto"
                    name="puntos_canjeados"
                    isClearable
                    isSearchable
                    value={
                      values.id_metodo_punto
                        ? { value: values.id_metodo_punto, label: "2000" }
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
                    name="puntos_canjeados"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">
                  Cantidad a aplicar {isEditable ? "(Aplica)" : "(No aplica)"}{" "}
                </label>
                <div className="control">
                  <Field
                    className="input"
                    type="number"
                    name="puntosCanjeados"
                    value={isEditable ? values.puntosCanjeados || 0 : 0}
                    placeholder={
                      isEditable
                        ? "Digite la cantidad de puntos"
                        : "No aplica para aplicar puntos"
                    }
                    readOnly={!isEditable}
                    onChange={(e) => {
                      if (isEditable) {
                        const valor = parseInt(e.target.value, 10) || 0;

                        setNotification(null);
                        setFieldValue("puntosCanjeados", valor);

                        if (valor < configData.minimoPuntoCanjear) {
                          setNotification({
                            message: `El valor mínimo es ${configData.minimoPuntoCanjear}.`,
                            type: "error",
                          });
                        } else if (valor > configData.limiteCanjeXAlquiler) {
                          setNotification({
                            message: `El valor máximo permitido es ${configData.limiteCanjeXAlquiler}.`,
                            type: "warning",
                          });
                          setFieldValue(
                            "puntosCanjeados",
                            configData.limiteCanjeXAlquiler
                          );
                        }
                      }
                    }}
                  />
                  <ErrorMessage
                    name="puntosCanjeados"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Metodo de pago</label>
                <div className="control">
                  <Select
                    options={[
                      { value: 1, label: "Efectivo" },
                      { value: 2, label: "Transferencia" },
                      { value: 1, label: "Tarjeta" },
                    ]}
                    placeholder="Seleccione un producto"
                    name="metodo_pago"
                    isClearable
                    isSearchable
                    value={
                      values.id_metodo_pago
                        ? { value: values.id_metodo_pago, label: "Efectivo" }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFieldValue("metodo_pago", selectedOption?.value || "");
                    }}
                  />
                  <ErrorMessage
                    name="metodo_pago"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={envioVehiculo}
                      onChange={(e) => setEnvioVehiculo(e.target.checked)}
                    />
                    ¿Desea que enviemos el vehículo?
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={recogidaVehiculo}
                      onChange={(e) => setRecogidaVehiculo(e.target.checked)}
                    />
                    ¿Es la misma direccion para la recogida?
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={isDireccionPropia}
                      onChange={(e) => setisDireccionPropia(e.target.checked)}
                    />
                    Direccion Propia
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={isLugarComun}
                      onChange={(e) => setIsLugarComun(e.target.checked)}
                    />
                    Lugar Comun
                  </label>
                </div>
              </div>
            </div>

            <div className="field-is-grouped">
              <div className="control">
                <button
                  className="button-is-primary"
                  type="button"
                  onClick={() => {
                    if (mountTotal > 0 && arrayDetalleReserva) {
                      setModalIsOpen(true);
                    } else {
                      Swal.fire({
                        title: "RentEasy Alert",
                        text: "Llene los campos correspondientes",
                        icon: "Info",
                      });
                    }
                  }}

                  // console.log(email.email)
                  // console.log(detalleEmail)

                  //El HandleEmail lo Movi al HandleSubmit**************************************
                >
                  Confirmar Renta
                </button>
              </div>
              <div className="control">
                <button
                  className="button-is-light"
                  type="reset"
                  onClick={() => {
                    arrayDetalleReserva == null;
                    setModalIsOpen(true);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div className="group">
              <label className="label">Filtrar Vehiculos</label>
              <div className="field">
                <label className="label">Fecha De inicio</label>
                <div className="control">
                  <Field
                    className="input"
                    type="datetime-local"
                    name="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => {
                      const isoDate = new Date(e.target.value);
                      const formattedDate = format(isoDate, "yyyy-MM-dd HH:mm"); // Formato deseado
                      setFechaInicio(formattedDate);
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
                <label className="label">Fecha final</label>
                <div className="control">
                  <Field
                    className="input"
                    type="datetime-local"
                    name="fechaFin"
                    value={fechaFin}
                    onChange={(e) => {
                      const isoDate = new Date(e.target.value);
                      const formattedDate = format(isoDate, "yyyy-MM-dd HH:mm"); // Formato deseado
                      setFechaFin(formattedDate);
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
                      if (selectedOption.value) {
                        setFieldValue("id_marca", selectedOption?.value);
                        handleModel(selectedOption.value);
                        handleSelectChange(selectedOption, 0);
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
                      if (selectedOption) {
                        setFieldValue("id_modelo", selectedOption.value);
                        handleVersion(selectedOption.value);
                        handleSelectChange(selectedOption, 1);
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
                      handleSelectChange(selectedOption, 2);
                    }}
                  />
                  <ErrorMessage
                    name="id_veersion"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Filtrar</label>
                <div className="control">
                  <button
                    type="button"
                    className="buttonFilter"
                    onClick={(e) => {
                      const fechaI = new Date(fechaInicio);
                      const fechaF = new Date(fechaFin);
                      if (isNaN(fechaI) || isNaN(fechaF)) {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "Las fechas son invalidas",
                        });
                      } else {
                        handleChange(e);
                        handleVehicle(
                          miArreglo[0],
                          miArreglo[1],
                          miArreglo[2],
                          fechaInicio
                        );
                        let diferenciaDias = calcularDiferenciaDias(
                          fechaInicio,
                          fechaFin
                        );
                        setDayCalculos(diferenciaDias);
                      }
                    }}
                  >
                    Filtrar
                  </button>
                </div>
              </div>
            </div>
            <div className="tableVehiculos">
              <div className="controlVehicle">
                <div className="table-section">
                  <h2>Vehiculos Filtrados</h2>
                  <table className="tabla1" name="tabla">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Version</th>
                        <th>Año</th>
                        <th>Color</th>
                        <th>Traccion</th>
                        <th>Categoria</th>
                        <th>Imagen</th>
                        <th>Precio X dia</th>
                        <th>Total</th>
                        {envioVehiculo && <th>Dirección</th>}{" "}
                        {envioVehiculo && !recogidaVehiculo && (
                          <th>Recogida</th>
                        )}
                        <th>Accion</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicleFound.map((vehicle) => (
                        <tr key={vehicle.id_vehiculo}>
                          <td>{vehicle.id_vehiculo}</td>
                          <td>{vehicle.marca}</td>
                          <td>{vehicle.modelo}</td>
                          <td>{vehicle.version}</td>
                          <td>{vehicle.año}</td>
                          <td>{vehicle.color}</td>
                          <td>{vehicle.traccion}</td>
                          <td>{vehicle.categoria}</td>
                          <td></td>
                          <td>{vehicle.precio}</td>
                          <td>
                            {daysCalculo === 0
                              ? vehicle.precio
                              : vehicle.precio * daysCalculo}{" "}
                          </td>
                          {envioVehiculo &&
                            renderDireccionSelect(vehicle, "entrega")}

                          {envioVehiculo &&
                            !recogidaVehiculo &&
                            renderDireccionSelect(vehicle, "recogida")}

                          <td>
                            <button
                              className="buttonSeleccionar buttonAccion"
                              type="button"
                              onClick={() => {
                                handleVehicleSelected(
                                  vehicle,
                                  daysCalculo === 0
                                    ? vehicle.precio
                                    : vehicle.precio * daysCalculo,
                                  fechaInicio,
                                  fechaFin,
                                  setFieldValue
                                );
                                // handleSelected();
                                //  let mount = arrayDetalleReserva.reduce((total, arrayDetalleReserva)=> total + arrayDetalleReserva.total, 0)
                                //  setMountTotal(mount)
                              }}
                            >
                              {arrayDetalleReserva.some(
                                (detalle) =>
                                  detalle.id_vehiculo === vehicle.id_vehiculo
                              )
                                ? "Seleccionado"
                                : "Seleccionar"}

                              {/* {
                                  arrayDetalleReserva.reduce((detalle)=> )
                                } */}
                            </button>{" "}
                            <button
                              className="buttonVerOferta buttonAccion"
                              type="button"
                              onClick={() => {
                                handleModal();
                                handlevisible();
                                setMyArrayData(vehicle);
                              }}
                            >
                              Ver Oferta
                            </button>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* {vehicleFound.map((vehicle) => (
                  <DinamicVehicle
                    key={vehicle.id_vehiculo}
                    image={"Mercedez.jpeg"}
                    name={vehicle.modelo}
                    year={vehicle.año}
                    price={"45US"}
                  />
                ))} */}
              </div>
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              className="ReactModal__ContentPayment"
              overlayClassName="ReactModal__OverlayPayment"
            >
              <div className="modalContainer">
                <h2>Procesar Pago</h2>
                <form className="modalForm">
                  <div className="formGroup">
                    <label htmlFor="currency">Metodo de pago:</label>

                    <div className="field">
                      <div className="control">
                        <Select
                          styles={{
                            position: "absolute",
                            width: "300px",
                          }}
                          options={paymentMethod.map((brandd) => ({
                            value: brandd.id_metodo_pago,
                            label: brandd.nombre,
                          }))}
                          placeholder="Seleccione el tipo"
                          isClearable
                          isSearchable
                          name="id_metodo_pago"
                          value={
                            values.id_tipo_moneda
                              ? {
                                  value: values.id_metodo_pago,
                                  label:
                                    paymentMethod.find(
                                      (item) =>
                                        item.id_metodo_pago ===
                                        values.id_metodo_pago
                                    )?.nombre || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption.value) {
                              setFieldValue(
                                "id_metodo_pago",
                                selectedOption?.value
                              );
                              // handleModel(selectedOption.value);
                              // handleSelectChange(selectedOption, 0);
                            } else {
                              setFieldValue("id_metodo_pago", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="id_metodo_pago"
                          component="p"
                          className="help is-danger"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="currency">Tipo de Moneda:</label>
                    <div className="field">
                      <div className="control">
                        <Select
                          options={tipoMoneda.map((brandd) => ({
                            value: brandd.id_tipo_moneda,
                            label: brandd.moneda,
                          }))}
                          placeholder="Seleccione el tipo"
                          isClearable
                          isSearchable
                          name="id_tipo_moneda"
                          value={
                            values.id_tipo_moneda
                              ? {
                                  value: values.id_tipo_moneda,
                                  label:
                                    tipoMoneda.find(
                                      (item) =>
                                        item.id_tipo_moneda ===
                                        values.id_tipo_moneda
                                    )?.moneda || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption.value) {
                              setFieldValue(
                                "id_tipo_moneda",
                                selectedOption?.value
                              );
                              // handleModel(selectedOption.value);
                              // handleSelectChange(selectedOption, 0);
                            } else {
                              setFieldValue("id_tipo_moneda", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="id_tipo_moneda"
                          component="p"
                          className="help is-danger"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="amount">Monto a Pagar:</label>
                    <input
                      type="number"
                      id="amount"
                      value={mountTotal}
                      // onChange={(e) => setAmount(e.target.value)}
                      required
                      placeholder="Ingrese el monto"
                    />
                  </div>

                  <div className="buttonActions">
                    <button
                      type="button"
                      className="button cancel"
                      onClick={() => setModalIsOpen(false)}
                    >
                      Cancelar
                    </button>
                    {/* <button
                      type="button"
                      className="button process"
                      onClick={() => setModalIsOpen(false)}
                    >
                      Procesar Pago
                    </button> */}
                     <button type="submit" className="button process">
                      Procesar Pago
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          </Form>
        )}
      </Formik>
    </section>
  );
  function calcularDiferenciaDias(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return "Por favor, ingrese fechas válidas.";
    }

    const diferenciaTiempo = fin.getTime() - inicio.getTime();
    const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);

    return Math.ceil(diferenciaDias);
  }

  // function calcularPntos
}
