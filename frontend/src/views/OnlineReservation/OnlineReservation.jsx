import React from "react";
import "./OnlineReservation.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import ButtonPaypal from "../../PaypalApi/Paypal";
import RentEasyDatePicker from "../../components/RentEasyDatePicker";
import getAccesories from "./getAccesories";
import getNotAvailableDates from "./getNotAvailableDates";
import dateValidation from "./dateValidation";
import GoBackButton from "../../components/GoBackButton";
import Select from "react-select";
import { useAuth } from "../../contexts/AuthContex";
import ConfirmReservaBTN from "../../components/ConfirmReservaBTN";
import Modal from "react-modal";
import Swal from "sweetalert2";

// Configurar React Modal
Modal.setAppElement("#root");

export default function OnlineReservation({ vehicle, setTest }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dayss, setdayss] = useState([]);

  const [accessories, setAccessories] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countDays, setCountDays] = useState(0);
  const [mountTotal, setMountTotal] = useState(0);
  const [politicaPagoReserva, setPoliticaPagoReserva] = useState([]);
  const [mountReserva, setMountReserva] = useState(0);
  const [isDelivery, setIsDelivery] = useState(false);
  const [samePickupAddress, setSamePickupAddress] = useState(true);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState("");
  const [selectedPickupAddress, setSelectedPickupAddress] = useState("");
  const [notAvailableDates, setNotAvailableDates] = useState([]);
  const [blockD, setblockD] = useState([]);

  const [clientData, setclientData] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState({});

  const [getDireccion, setGetDireccion] = useState([]);
  const [envioVehiculo, setEnvioVehiculo] = useState(false);
  const [recogidaVehiculo, setRecogidaVehiculo] = useState(true);
  const [isDireccionPropia, setisDireccionPropia] = useState(false);
  const [isLugarComun, setIsLugarComun] = useState(false);

  const [lugarComun, setLugarComun] = useState([]);
  const [puntosCanjeados, setPuntosCanjeados] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [emailFound, setEmailFound] = useState("");
  const [nameFound, setNameFound] = useState("");
  const [telefonoFound, setTelefonoFound] = useState("");

  const [paymentDetails, setpaymentDetails] = useState(undefined);

  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
    if (user?.email) {
      const { email } = user;
      axios
        .get("http://localhost:3000/api/clients/exist", {
          params: { email },
        })
        .then((response) => {
          if (response.data) {
            setclientData(response.data);

            console.log(response.data);
          } else {
            setclientData([]);
          }
        })
        .catch((error) => {
          console.error("Error al obtener los datos", error);
        });
    }
  }, []);

  useEffect(() => {
    setSubTotal(mountTotal - mountReserva - puntosCanjeados);
  }, [mountTotal, mountReserva, puntosCanjeados]);

  useEffect(() => {
    if (dayss.length > 0) {
      setMountTotal(dayss.length * vehicle.precio);
    }
  }, [dayss]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/lugarComun").then((response) => {
      setLugarComun(response.data);
      console.log(response.data);
    });

    if (clientData.id_entidad) {
      axios
        .get(`http://localhost:3000/api/direccion/${clientData.id_entidad}`)
        .then((response) => {
          setGetDireccion(response.data);
          console.log("Datos de direccion", response.data);
        });
    }
  }, []);

  const handledireccion = (id) => {
    // console.log(id);
    axios.get(`http://localhost:3000/api/direccion/${1}`).then((response) => {
      setGetDireccion(response.data);
      console.log("Datos de direccion", response.data);
    });
  };
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
        <Select
          className="selectDirection"
          // style={{
          //   width: "100%",
          //   backgroundColor: "red"
          // }}
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
            direccionSeleccionada[vehicle.id_vehiculo]?.[tipoDireccion] || null
          }
          onChange={(selectedOption) =>
            handleDireccionChange(
              vehicle.id_vehiculo,
              tipoDireccion,
              selectedOption
            )
          }
        />
      );
    }
    if (envioVehiculo && !isDireccionPropia && isLugarComun) {
      return (
        <Select
          className="selectDirection"
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
            direccionSeleccionada[vehicle.id_vehiculo]?.[tipoDireccion] || null
          }
          onChange={(selectedOption) =>
            handleDireccionChange(
              vehicle.id_vehiculo,
              tipoDireccion,
              selectedOption
            )
          }
        />
      );
    }
    // Entrada Manual de Dirección
    return (
      <input
        className="inputDirection"
        type="text"
        placeholder="Ingrese la dirección manualmente"
        value={
          direccionSeleccionada[vehicle.id_vehiculo]?.[tipoDireccion]?.label ||
          ""
        }
        onChange={(e) =>
          handleDireccionChange(vehicle.id_vehiculo, tipoDireccion, {
            value: e.target.value,
            label: e.target.value,
          })
        }
      />
    );
  };

  function handleVerifyng() {
    setIsVerifying(!isVerifying);
  }
  let direccion = [];

  // Verifico si hay una dirección seleccionada para el vehículo
  if (direccionSeleccionada[vehicle.id_vehiculo]) {
    direccion = [...direccion, direccionSeleccionada[vehicle.id_vehiculo]];
  }
  const valEnt = direccion[0]?.entrega?.value || direccion[0]?.recogida?.value;
  const valRec = direccion[0]?.recogida?.value || direccion[0]?.entrega?.value;
  let dirdata;
  if (envioVehiculo) {
    dirdata = isDireccionPropia ? "Propia" : isLugarComun ? "Comun" : "Manual";
  }

  const paypalHandleSubmit = (details) => {
    const dataToSend = {
      id_cliente: clientData?.id_cliente,
      monto_por_la_reserva: mountReserva,
      subTotal: mountTotal,
      total: subTotal,
      OrigenReserva: "Online",
      puntosCanjeados: puntosCanjeados,
      id_politica_pago_reserva: politicaPagoReserva.id_politica_pago_reserva,
      detalles: [
        {
          id_vehiculo: vehicle.id_vehiculo,
          total: mountTotal,
          fechaInicio: startDate,
          fechaFin: endDate,
          precio: vehicle.precio,
          entrega: valEnt,
          recogida: valRec,
          direccion: dirdata,
        },
      ],
    };

  
     try {
       axios
        .post("http://localhost:3000/api/reserva", dataToSend)
         .then((response) => {
       Swal.fire({
         title: "RentEasy Alert",
         text: "Su reserva ha sido creada con exito",
         icon: "success"
       })
         });
     } catch (error) {
       console.error("Error al enviar la reserva:", error);
   }
  };

  const handleClientVeriyng = async (email) => {
    const responseAxios = await axios.get(
      "http://localhost:3000/api/clients/exist",
      {
        params: { email },
      }
    );

    if (responseAxios.data.message) {
      const dataToSend = {
        nombre: nameFound,
        email: emailFound,
        telefono: telefonoFound,
      };
      await axios
        .post("http://localhost:3000/api/createFastClient", dataToSend)
        .then((response) => {
          console.log(response.data.id_cliente);
          setclientData(response.data);
          handleSubmit(false, response.data.id_cliente);
        });
    } else {
      setclientData(responseAxios.data[0]);
      handleSubmit(undefined, responseAxios.data[0].id_cliente);
    }
  };

  const handleSubmit = (exec, id) => {
    if (clientData.length === 0 && exec) {
      setModalIsOpen(true);
      console.log("Usuario no logueado:", clientData);
      return;
    }

    const dataToSend = {
      id_cliente: id ?? clientData?.[0]?.id_cliente,
      monto_por_la_reserva: mountReserva,
      subTotal: mountTotal,
      total: subTotal,
      OrigenReserva: "Online",
      puntosCanjeados: puntosCanjeados,
      id_politica_pago_reserva: politicaPagoReserva.id_politica_pago_reserva,
      detalles: [
        {
          id_vehiculo: vehicle.id_vehiculo,
          total: mountTotal,
          fechaInicio: startDate,
          fechaFin: endDate,
          precio: vehicle.precio,
          entrega: valEnt,
          recogida: valRec,
          direccion: dirdata,
        },
      ],
    };

    console.log("Enviando datos:", dataToSend);
    if (mountReserva <= 0) {
      try {
        axios
          .post("http://localhost:3000/api/reserva", dataToSend)
          .then((response) => {
            Swal.fire({
              title: "RentEasy Alert",
              text: "Su reserva ha sido creada con exito",
              icon: "success"
            })
          });
      } catch (error) {
        Swal.fire({
          title: "RentEasy Alert",
          text: "Hubo un error al crear la reserva",
          icon: "success"
        })
      }
    }
  };

  const validateBTN = () => {
    if (mountTotal > 0 && envioVehiculo) {
      if (Object.entries(direccionSeleccionada).length > 0) {
        return <ConfirmReservaBTN onClick={handleSubmit} />;
      }
    }

    if (mountTotal > 0 && !envioVehiculo) {
      return <ConfirmReservaBTN onClick={handleSubmit} />;
    }

    return <></>;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/politicPayReserva")
      .then((response) => {
        if (response.data.length > 0) {
          setPoliticaPagoReserva(response.data[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const days = dateValidation(
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        blockD,
        setdayss
      );
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (mountTotal > 0) {
      let montoPorReserva =
        (mountTotal * politicaPagoReserva.porcentajeAPagar) / 100;
      setMountReserva(montoPorReserva);
    }
  }, [mountTotal]);

  useEffect(() => {
    if (!envioVehiculo) {
      setDireccionSeleccionada([]);
    }
  }, [envioVehiculo]);

  useEffect(() => {
    if (!vehicle) return;

    getAccesories(setAccessories, vehicle);
    getNotAvailableDates(setNotAvailableDates, vehicle);
  }, []);
  return (
    <div className="sectionOnlineReservation">
      <div className="namecarAndPriceDetails">
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <GoBackButton onclick={() => setTest(undefined)} />
          <div className="nameCar carPrice">
            <h1>
              {vehicle?.marca} {vehicle?.modelo} {vehicle?.veersion}{" "}
              {vehicle?.año}{" "}
            </h1>
          </div>
          <div className="clientName carPrice">
            <h1>{clientData[0]?.nombre} </h1>
          </div>
          <div className="priceCar carPrice">
            <h1>Precio: {vehicle?.precio} /dia</h1>
          </div>
        </div>
      </div>
      <section className="sectionContentOnlineReservation">
        <div className="accesoryCar carDataOnlineReservation">
          <div className="accesoryTitle">
            <h1>Accesorios del Vehiculo</h1>
          </div>
          <div className="dinamicAccesory">
            {Array.isArray(accessories) &&
              accessories.map((item) => (
                <div className="accessory-item" key={item?.id_accesorio}>
                  <span className="accessory-circle"></span>
                  <span className="accessory-name">{item?.nombre}</span>
                </div>
              ))}
          </div>
          <div></div>
        </div>
        <div className="carData carDataOnlineReservation">
          <Formik
            initialValues={{
              fechaInicio: "",
              fechaFin: "",
            }}
            onSubmit={(values, { resetForm }) => {
              //verificarDisponibilidad(values);
              // handleVerifyng();
              // resetForm();
            }}
          >
            {({ handleChange, values, setFieldValue }) => (
              <Form className="CarDataDisponibilidad">
                {notAvailableDates && (
                  <>
                    {/* <Advertence /> */}
                    <div
                      className=""
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <label
                        className=""
                        style={{
                          paddingTop: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Fecha Inicio
                      </label>
                      <RentEasyDatePicker
                        selectedDate={startDate}
                        setBlockedDates={setblockD}
                        setSelectedDate={setStartDate}
                        dates={notAvailableDates}
                      />
                    </div>
                    <div
                      className=""
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <label
                        className=""
                        style={{
                          paddingTop: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Fecha Fin
                      </label>
                      <RentEasyDatePicker
                        selectedDate={endDate}
                        setBlockedDates={setblockD}
                        setSelectedDate={setEndDate}
                        dates={notAvailableDates}
                      />

                      <button
                        style={{
                          backgroundColor:
                            startDate && endDate ? "green" : "gray",
                          color: "white",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "none",
                          cursor:
                            startDate && endDate ? "pointer" : "not-allowed",
                          marginTop: "10px",
                          position: "absolute",
                          right: "10px",
                        }}
                        disabled={!(startDate && endDate)}
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                          setMountReserva(0);
                          setMountTotal(0);
                          setdayss([]);

                          // localStorage.removeItem("days");
                          // handleSubmit();
                        }}
                      >
                        Limpiar fechas
                      </button>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>
          <div className="dataVehicleDetails datavehicleLocartion">
            <div className="datavehicleDetails1 dv1">
              <span>👤 {vehicle.capacidadPersonas} pasajeros</span>
              <span>🧳 {vehicle.transmision} </span>
              <span>Color: {vehicle.color} </span>
              <span>Traccion: {vehicle.traccion}</span>
              <span>{vehicle.numPuertas} Puertas</span>
            </div>
            {/* <div className="datavehicleDetails2 dv1">

            </div> */}
            <div className="datavehicleDetails3 dv1">
              <img src={vehicle.imagen_url} alt="" />
            </div>
          </div>
          <div className="reservLocation datavehicleLocartion">
            <h3 className="section-title">Opciones de Entrega o Recogida</h3>
            <div className="group">
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={envioVehiculo}
                      onChange={(e) => {
                        setEnvioVehiculo(e.target.checked);
                      }}
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
              {user && (
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
              )}
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
            <div className="envioDireccion">
              <div className="envioEntrega envSame">
                {envioVehiculo && renderDireccionSelect(vehicle, "entrega")}
              </div>
              <div className="envioRecogida envSame">
                {envioVehiculo &&
                  !recogidaVehiculo &&
                  renderDireccionSelect(vehicle, "recogida")}
              </div>
            </div>
          </div>
        </div>
        <div className="detailsReservation carDataOnlineReservation">
          <div className="priceDayDetails">
            <div className="detailsReserDiv sameReserv">
              <h1 className="details-title">
                <strong>Detalles de Reserva</strong>
              </h1>
            </div>

            <div className="mountForReserv sameReserv">
              <span className="reservation-amount">
                <strong>
                  Monto por la Reserva: $
                  {mountReserva ? mountReserva.toFixed(2) : 0} DOP
                </strong>
              </span>
            </div>

            <div className="canjePoints">
              <div className="points-section">
                <div className="field">
                  <label className="label points-label">Puntos</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input points-input"
                      placeholder="Introduce tus puntos"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label apply-label">
                    Cantidad a Aplicar
                  </label>
                  <div className="control">
                    <input
                      type="number"
                      className="input apply-input"
                      placeholder="Introduce cantidad"
                      value={puntosCanjeados}
                      onChange={(e) => {
                        setPuntosCanjeados(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detailsTotalAndReserv">
            <div className="tittlePriceDetails">
              <h1>
                {" "}
                <strong>Detalle de precios</strong>
              </h1>
            </div>
            <div className="tittlePriceDetails payNow">
              <h1>Paga Ahora</h1>
            </div>
            <div className="tittlePriceDetails totalMount">
              <div className="daysAndPrice">
                <span> {countDays ? countDays : 1} Dias</span>
                <span>${vehicle.precio.toFixed(2) ?? 0} Por Dia</span>{" "}
                {/* ${vehicle.precio.toFixed(2) ?? 0} Por Dia */}
              </div>
              <div className="totalMount">
                <span>${dayss.length ? dayss.length * vehicle.precio : 0}</span>{" "}
              </div>
            </div>
            <div className="totalToPay">
              <div className="tittlePriceDetails totalMount">
                <div className="daysAndPrice">
                  <span>Total</span>
                </div>
                <div className="totalMount">
                  <span onChange={() => {}}>
                    ${subTotal > 0 ? subTotal : 0}
                  </span>
                </div>
              </div>{" "}
            </div>
            <div className="buttonReserv">
              {mountReserva > 0 &&
              (clientData?.id_cliente || clientData[0]?.id_cliente) ? (
                <ButtonPaypal
                  paypalHandleSubmit={paypalHandleSubmit}
                  mount={mountReserva}
                />
              ) : (
                validateBTN()
              )}
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              className="ReactModal__ContentenidoOnlineReservation"
              overlayClassName="ReactModal__OverlayReservation"
            >
              <div className="modalFather">
                <h2>Completa tus datos</h2>
                <form onSubmit={handleSubmit} className="modalForm">
                  <div className="formGroup">
                    <label htmlFor="name">Nombre:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={nameFound}
                      onChange={(e) => {
                        setNameFound(e.target.value);
                      }}
                      required
                      placeholder="Escribe tu nombre"
                    />
                  </div>
                  <div className="formGroup">
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={emailFound}
                      onChange={(e) => {
                        setEmailFound(e.target.value);
                      }}
                      required
                      placeholder="Escribe tu correo electrónico"
                    />
                  </div>
                  <div className="formGroup">
                    <label htmlFor="phone">Número de Teléfono:</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={telefonoFound}
                      onChange={(e) => {
                        setTelefonoFound(e.target.value);
                      }}
                      required
                      placeholder="Escribe tu número de teléfono"
                    />
                  </div>
                  <div className="formGroup">
                    <label htmlFor="id">Cédula/Identificación:</label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      // value={formData.i}
                      // onChange={handleChange}
                      required
                      placeholder="Escribe tu cédula/identificación"
                    />
                  </div>
                  <div className="buttonActionModal">
                    <button
                      type="button"
                      className="button"
                      onClick={() => setModalIsOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="button"
                      onClick={() => {
                        setModalIsOpen(false);
                        handleClientVeriyng(emailFound);
                      }}
                      // Forma correcta
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </section>
    </div>
  );
}
