import { Field, Formik, Form } from "formik";
import "./style.css";
import { dataMap } from "../../../config/data";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Paypal from "../../../PaypalApi/Paypal";
import { set } from "date-fns";
import axios from "axios";
import Modal from "react-modal";
import calcularPenalidad from "../../../components/OnlileModifierReserva/CalculoPenalidad";
Modal.setAppElement("#root");

export default function RentForm({
  rents = {},
  initialState,
  setinitialState,
}) {
  const [startDate, setstartDate] = useState(undefined);
  const [endDate, setendDate] = useState(undefined);
  const [processPayment, setprocessPayment] = useState(false);
  const [rentass, setRentass] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [newT, setnewT] = useState(0);
  const [razonCancelacionSeleccionada, setRazonCancelacionSeleccionada] = useState("")
  const [politicaCancelacion, setPoliticaCancelacion] = useState([])
    const [clientData, setclientData] = useState([]);
    const [razonCancelacion, setRazonCancelacion] = useState([]);
    const [comentario, setComentario] = useState("");
      const [isOpenModalCancelar, setIsOpenModalCancelar] = useState(false);
    const [mountPenalidad, setMountPenalidad] = useState(0)
    const [totalReserva, setTotalReserva] = useState(0)
    const [totalAPagar, setTotalAPagar] = useState(0)
      const [selectedCancelReserva, SetSeletecCancelReserva] = useState([]);
    
    

  //console.log(initialState);

    useEffect(()=>{
      if(mountPenalidad ===100){
        setTotalAPagar(rents.total)

      }else{
        setTotalAPagar(rents.total-(mountPenalidad*totalReserva/100))

      }
    }, [mountPenalidad])


  useEffect(() => {
    if (endDate < startDate) {
      Swal.fire({
        title: "Error",
        text: "La fecha de fin no puede ser menor a la fecha de inicio",
        icon: "error",
      });
       setprocessPayment(false);
      return;
    }

   
    // console.log("Fecha de inicio", startDate);
    // console.log("Fecha de fin", endDate);

    if (startDate && endDate) {
      //   console.log("Fecha de inicio", startDate);
      //   console.log("Fecha de fin", endDate);

      //   console.log(formatDate(initialState.fechaInicio));
      //   console.log(formatDate(initialState.fechaFin));

      const lastDate = new Date(initialState.fechaFin);

      const newEndDate = new Date(endDate);
      const newStartDate = new Date(startDate);

      // if (newStartDate > lastDate && newEndDate > lastDate) {
      // }
    }
  }, [startDate, endDate]);

  //   useEffect(() => {
  //     console.log(initialState);
  //   }, [initialState]);

  const { detalles } = rents;

  const handleEditRent = (rent) => {
    setinitialState(rent);
  };

  const validateDate = (date) => {};

  const handleSubmitCancel = (id_renta) => {
    const datatoSend = {
      id_renta: id_renta ? id_renta : 0,
      id_razon: razonCancelacionSeleccionada ? razonCancelacionSeleccionada : 0,
      penalidad: totalAPagar ? totalAPagar : 0,
    };
  
    console.log("Datos a enviar:", datatoSend);
  
    try {
      axios
        .put("http://localhost:3000/api/rent/cancel/rent", datatoSend)
        .then((response) => {
          Swal.fire({
            title: "Su Renta ha sido cancelada con exito",
            text: "La empresa de pondra en contacto con usted para el rembolso de su dinero en caso de que sea necesario",
            icon: "success",
          });
        });
    } catch (error) {
      console.log("Error getting data", error);
    }
  };
  

  const paypalHandleSubmit = (details) => {
    const datatoSend = {
      id_renta: initialState.id_renta,
      id_vehiculo: initialState.id_vehiculo,
      nuevo_costo: newT,
      fechaInicio: formatDate(startDate),
      fechaFin: formatDate(endDate),
    };

    try {
      axios
        .put("http://localhost:3000/api/rent", datatoSend)
        .then((response) => {
          setinitialState({
            id_renta: 0,
            id_vehiculo: 0,
            id_version: 0,
            marca: "",
            modelo: "",
            version: "",
            color: "",
            año: 0,
            fechaInicio: "",
            fechaFin: "",
            id_marca: 0,
            id_modelo: 0,
            id_veersion: 0,
            total: 0,
            precio: 0,
            imagen_url: "",
            placa: "",
          });
          setnewT(0)
          setprocessPayment(false)
          Swal.fire({
            title: "Pago completado con exito",
            icon: "success",
          });
        });
    } catch (error) {
      console.log("Error getting data", error);
    }
    console.log(details);
  };

  async function getRazones() {
    await axios
      .get("http://localhost:3000/api/razonesCancelacionReserva")
      .then((response) => {
        setRazonCancelacion(response.data);
      });
  }

  async function getPoliticasCancelacion() {
    await axios
      .get("http://localhost:3000/api/politicaCancelacion")
      .then((response) => {
        setPoliticaCancelacion(response.data);
        // console.log(response.data)
      });
  }

  const handleCancelarReserva = (rents) => {

   setTotalReserva(rents.total)
     console.log(rents)
     SetSeletecCancelReserva(rents);
     setIsOpenModalCancelar(true);
     if (!rents) {
       console.error("Error: La reserva no está definidas.");
       return;
   }



   if (!rents.detalles || !Array.isArray(rents.detalles)) {
    console.error("Error: La reserva no contiene un arreglo de detalles válido.");
    return;
}
const detalle = rents.detalles; 
// console.log(detalle)

const fecha = formatDate(detalle[0].fechaFin);

// console.log(fecha)

if (!detalle || !detalle[0].fechaInicio) {
    console.error("Error: El detalle no tiene una fechaInicio válida.");
    return;
}
   setMountPenalidad(100-(calcularPenalidad(fecha, politicaCancelacion)))
     getRazones();
     getPoliticasCancelacion();
  };


  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getUTCFullYear();
    const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + d.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

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

  const verificarDisponibilidad = async (
    id_vehiculo,
    fechaInicio,
    fechaFin
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/vehicle/${id_vehiculo}/${fechaInicio}/${fechaFin}`
      );
      if (response.data.disponible) {
        setprocessPayment(true);

        Swal.fire({
          title: "Disponible",
          text: "El vehículo está disponible.",
          icon: "success",
        });
        setprocessPayment(true);

        const days = calcularDiferenciaDias(fechaInicio, fechaFin);
        setnewT(initialState.precio * days);
        //  setinitialState((prev) => ({
        //   ...prev,
        //   total: days * prev.precio
        //  }))
        // setIsVerifying(false);
      } else {
        const conflictos = response.data.conflictos || [];
        const conflictosDetalles = conflictos
          .map(
            (c) =>
              `- Estado: ${c.estado}, desde ${formatDate(
                c.fechaInicioReserva || c.fechaInicioRenta
              )} hasta ${formatDate(c.fechaFinReserva || c.fechaFinRenta)}`
          )
          .join("\n");

        Swal.fire({
          title: "No disponible",
          text: `El vehículo no está disponible. Conflictos encontrados:\n${conflictosDetalles}`,
          icon: "info",
        });
        // setIsVerifying(false);
      }
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      alert(
        "Ocurrió un error al verificar la disponibilidad. Intente nuevamente."
      );
    }
  };

  return (
    <>
      <Formik
        initialValues={initialState}
        onSubmit={(values) => {
          console.log("Formulario enviado:", values);
        }}
      >
        {(values) => {
          const { setValues } = values;

          useEffect(() => {
            setstartDate(formatDate(initialState.fechaInicio));
            setendDate(formatDate(initialState.fechaFin));

            setValues({
              ...initialState,
              cliente: rents.cliente,
              fechaInicio: formatDate(initialState.fechaInicio),
              fechaFin: formatDate(initialState.fechaFin),
            });
          }, [initialState]);

          return (
            <Form className="rent_form">
              <div>
                <label>ID Renta</label>
                <Field name="id_renta" type="number" disabled />
              </div>

              <div>
                <label>Cliente</label>
                <Field name="cliente" type="text" disabled />
              </div>

              <div>
                <label>Marca</label>
                <Field name="marca" type="text" disabled />
              </div>

              <div>
                <label>Modelo</label>
                <Field name="modelo" type="text" disabled />
              </div>

              <div>
                <label>Versión</label>
                <Field name="version" type="text" disabled />
              </div>

              <div>
                <label>Color</label>
                <Field name="color" type="text" disabled />
              </div>

              <div>
                <label>Año</label>
                <Field name="año" type="number" disabled />
              </div>

              {/* <div>
            <label>Condición de Renta</label>
            <Field name="condicion_renta" type="number" />
          </div>

          <div>
            <label>Condición Detalle</label>
            <Field name="condicion_detalle" type="number" />
          </div> */}

              <div>
                <label>Placa</label>
                <Field name="placa" type="text" disabled />
              </div>

              <div>
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  value={startDate ?? formatDate(initialState.fechaInicio)}
                  onChange={(e) => setstartDate(e.target.value)}
                />
              </div>

              <div>
                <label>Fecha de Fin</label>
                <input
                  type="date"
                  value={endDate ?? formatDate(initialState.fechaFin)}
                  onChange={(e) => setendDate(e.target.value)}
                />
              </div>

              <div>
                <label>Precio</label>
                <Field name="precio" type="number" disabled />
              </div>

              <div>
                <label>Subtotal</label>
                <Field name="id_vehiculo" type="number" disabled />
              </div>

              <div>
                <label>Total</label>
                <Field name="total" type="number" disabled />
              </div>
              {/* <div>
            <label>ID Color</label>
            <Field name="id_color" type="number" />
          </div>

          <div>
            <label>ID Vehículo</label>
            <Field name="id_vehiculo" type="number" />
          </div>

          <div>
            <label>ID Cliente</label>
            <Field name="id_cliente" type="number" />
          </div>

          <div>
            <label>ID Marca</label>
            <Field name="id_marca" type="number" />
          </div>

          <div>
            <label>ID Versión</label>
            <Field name="id_veersion" type="number" />
          </div>

          <div>
            <label>ID Modelo</label>
            <Field name="id_modelo" type="number" />
          </div> */}

              {/* <div>
            <label>Imagen URL</label>
            <Field name="imagen_url" type="text" />
          </div> */}

              {/* <div>
            <label>Puntos Canjeados</label>
            <Field name="puntos_canjeados" type="number" />
          </div>

          <div>
            <label>Total Detalle</label>
            <Field name="total_detalle" type="number" />
          </div> */}

              <button
                type="button"
                onClick={() => {
                  verificarDisponibilidad(
                    initialState.id_vehiculo,
                    formatDate(startDate),
                    formatDate(endDate)
                  );
                }}
              >
                Validar disponibilidad
              </button>
              {processPayment && (
                <Paypal mount={newT} paypalHandleSubmit={paypalHandleSubmit} />
              )}
                 <div
                className="buttonCancelarOnline"
                onClick={() => handleCancelarReserva(rents)}
              >
                <button type="button">Cancelar Renta</button>
              </div>
              {newT !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-6rem",
                    bottom: "10px",
                    display: "flex",
                    gap: "3px",
                  }}
                >
                  <label
                    style={{
                      color: "red",
                    }}
                  >
                    NUEVO TOTAL:
                  </label>
                  ${newT}
                </div>
              )}
                <Modal
                      isOpen={isOpenModalCancelar}
                      onRequestClose={() => setIsOpenModalCancelar(false)}
                      contentLabel="Formulario de Cancelación"
                      className="custom-modal"
                      overlayClassName="custom-overlay"
                    >
                      <h2>Cancelar Renta</h2>
                      <form className="cancelar-reserva-form" /*onSubmit={handleSubmit}*/>
                        <div className="form-group">
                          <label htmlFor="razonCancelacion">Razón de la Cancelación:</label>
                          <select
                            id="razonCancelacion"
                            value={razonCancelacionSeleccionada}
                            onChange={(e) => setRazonCancelacionSeleccionada(e.target.value)}
                            required
                          >
                            <option value="" disabled>
                              Seleccione una razón
                            </option>
                            {razonCancelacion.map((item) => (
                              <option key={item.id_razon} value={item.id_razon}>
                                {item.descripcion}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="comentario">Comentarios Adicionales:</label>
                          <textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Escriba detalles adicionales aquí (opcional)"
                          />
                        </div>
                        <div className="MountPenalidad">
                          <div className="totalReserva">
                          <span>Monto Total de la reserva ${totalReserva} </span>
                          </div>
                          <div className="totalPenalidad">
                          <span>Penalidad: {mountPenalidad}% </span>
                          </div>
                          <div className="totalPenalidadReserva">
                          
                          <span>Monto Rembolsable: ${totalAPagar} </span>
                          </div>
                        </div>
                        <div className="modal-buttons">
                          <button style={{
                            maxHeight: "50px"
                          }}
                            type="button"
                            className="btn-cancelar"
                            onClick={() => setIsOpenModalCancelar(false)}
                          >
                            Cerrar
                          </button>
                          {/* {totalAPagar > 0 ?(
                           <Paypal mount={totalAPagar} paypalHandleSubmit={handleSubmitPaypal} />
                          ):( */}
                            <button type="button" className="btn-submit" onClick={()=>{
                              const id_renta = selectedCancelReserva.id_renta
                              handleSubmitCancel(id_renta)
                              }
                            }>
                            Cancelar Reserva
                          </button>
                          {/* )} */}
                        
                        </div>
                      </form>
                    </Modal>
            </Form>

          );
        }}
      </Formik>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Version</th>
            <th>Color</th>
            <th>Año</th>
            <th>Precio</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((r, index) => (
            <tr
              onClick={() => handleEditRent(r)}
              key={index}
              style={{
                cursor: "pointer",
                backgroundColor:
                  initialState.id_renta === r.id_renta
                    ? "rgb(213, 219, 219, .4)"
                    : "white",
              }}
            >
              <td>
                {/* <img
                      style={{
                        width: "150px",
                        height: "100%",
                        borderRadius: "10px",
                        objectfit: "contain",
                      }}
                      src={detalle.imagen_url}
                      alt={detalle.modelo}
                    />  */}
              </td>
              <td>{r.marca}</td>
              <td>{r.modelo}</td>
              <td>{r.version}</td>
              <td>{r.color}</td>
              <td>{r.año}</td>
              <td>{r.precio}</td>
              <td>{formatDate(r.fechaInicio)}</td>
              <td>{formatDate(r.fechaFin)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
