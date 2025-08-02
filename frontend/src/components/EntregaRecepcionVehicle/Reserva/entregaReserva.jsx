import axios from "axios";
import "./entregaReserva.css";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generarContratoPDF } from "./GenerarContrato";

export default function EntregaReserva() {
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [formData, setFormData] = useState({});
  const [obsevacion, setObservacion] = useState("");
  const [entregaDir, setEntregaDir] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getUTCFullYear();
    const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + d.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const location = useLocation();
  const reserva = location.state?.reserva;
  const details = location.state.reserva.detalles;
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
      const id_cliente = reserva.id_cliente
      try {

        axios
        .get(`http://localhost:3000/api/clients/contrato/${id_cliente}`)
        .then((response) => {
          setCliente(response.data); 
          console.log("Información del cliente:", response.data);

        });
      } catch (err) {
        console.error("Error al obtener el cliente:", err.message);
        setError("No se pudo obtener la información del cliente.");
      }

  }, []);


  useEffect(() => {
    axios
      .get("http://localhost:3000/api/InspeccionEntrega")
      .then((response) => {
        setAccessories(response.data);
      });
  }, []);

  // const [accessories, setAccessories] = useState([
  //   { id_accesorio: 1, label: "gato" },
  //   { id_accesorio: 2, label: "herramientas" },
  //   { id_accesorio: 3, label: "Pieza" },
  //   { id_accesorio: 4, label: "GomaRepuesto" },
  //   { id_accesorio: 5, label: "Extintor" },
  //   { id_accesorio: 6, label: "Botiquin" },
  //   { id_accesorio: 7, label: "Espejos." },
  //   { id_accesorio: 8, label: "SistemaAudio" },
  //   { id_accesorio: 9, label: "Frenos" },
  //   { id_accesorio: 10, label: "Limpiaparabrisas_en_buen_estado" },
  //   { id_accesorio: 11, label: "Llanta_de_repuesto_disponible" },
  //   { id_accesorio: 12, label: "Cinturones_de_seguridad" },
  //   { id_accesorio: 13, label: "Faros" },
  //   { id_accesorio: 14, label: "estado_bateria" },
  // ]);

  const navigate = useNavigate();

  const handleEntregaDireccion = (id) => {
    try {
      axios
        .get(`http://localhost:3000/api/InspeccionEntrega/${id}`)
        .then((response) => {
          setEntregaDir(response.data);
          console.log(response.data);
          alert(response.data);
        });
    } catch (error) {
      console.log("error direcion", error);
    }
  };

 

  const handleSubmit = async (id_vehiculo) => {
    const dataToSend = {
      id_vehiculo: id_vehiculo,
      id_reserva: reserva.id_reserva,
      id_cliente: reserva.id_cliente,
      Observaciones: obsevacion,
      subTotal: reserva.subTotal,
      total: reserva.subTotal,
      detalles: details,
      puntos_canjeados: reserva.puntos_canjeados,
      selectedAccessories: JSON.stringify(selectedAccessories),
      // accessoriesDetails: selectedAccessories.piece,
    };

    
    // if (Array.isArray(selectedAccessories) && selectedAccessories.length > 0) {
    //   dataToSend.selectedAccessories("selectedAccessories", JSON.stringify(selectedAccessories));
    // } else {
    //   dataToSend.selectedAccessories("selectedAccessories", JSON.stringify([]));
    // }
    

    console.log(dataToSend);

    try {
      axios
        .post("http://localhost:3000/api/InspeccionEntrega", dataToSend)
        .then((response) => {});

        await generarContratoPDF(reserva, details, cliente)
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleAccessoryChange = (e, accessoryId) => {
    if (e.target.checked) {
      setSelectedAccessories((prevSelected) => [...prevSelected, accessoryId]);
    } else {
      setSelectedAccessories((prevSelected) =>
        prevSelected.filter((id) => id !== accessoryId)
      );
    }
  };

  // useEffect(() => {
  //   if (reserva) {
  //     console.log(reserva);
  //     console.log(details);
  //     // handleEntregaDireccion(reserva.id_reserva)

  //     // alert(JSON.stringify(reserva, null, 2));
  //     const id = reserva.id_reserva;
  //     // console.log(id)
  //     if (id) {
  //       try {
  //         axios
  //           .get("http://localhost:3000/api/InspeccionEntrega/direcction", {
  //             params: { id },
  //           })
  //           .then((response) => {
  //             setEntregaDir(response.data);
  //             console.log(response.data);

  //             const datosEntrega = {};
  //             const datosRecogida = {};

  //             for (const [key, value] of Object.entries(response.data)) {
  //               if (key.includes("_entrega")) {
  //                 datosEntrega[key] = value;
  //               } else if (key.includes("_recogida")) {
  //                 datosRecogida[key] = value;
  //               }
  //             }

  //             console.log("Datos Entrega: ", datosEntrega);
  //             console.log("Datos Recogida: ", datosRecogida);
  //           });
  //       } catch (error) {
  //         console.log("error direcion", error);
  //       }
  //     }
  //   }
  // }, [reserva]);

  for (const detalle of details) {
    console.log("hello");
    const {
      id_vehiculo,
      fechaInicio,
      fechaFin,
      precio,
      total,
      color,
      año,
      modelo,
      marca,
      version,
      direccion,
      imagen_url,
      placa,
    } = detalle;

    return (
      <div className="sectionEntregaReserv">
        <div className="sectionEntregaInside">
          <div className="modal-content">
            {details.map((item) => (
              <div className="modal-header" key={item.id_reserva}>
                <div className="vehicle-info">
                  <img
                    src={item.imagen_url}
                    alt="Imagen del vehículo"
                    className="vehicle-image"
                  />
                  <div className="vehicle-details">
                    <p>
                      <strong>Modelo:</strong> {item.modelo}
                    </p>
                    <p>
                      <strong>Placa:</strong> {item.placa}
                    </p>
                    <p>
                      <strong>Año:</strong> {item.año}
                    </p>
                    <p>
                      <strong>Color:</strong> {item.color}
                    </p>
                  </div>
                </div>

                <div className="extra_info">
                  <div className="detailsClient detall">
                    <p>
                      <strong>Cliente:</strong> {reserva.cliente}
                    </p>
                    <p>
                      <strong>Fecha de Reserva:</strong>{" "}
                      {formatDate(reserva.fechaReserva)}
                    </p>
                    <p>
                      <strong>Duración:</strong> {item.duracion} días
                    </p>
                    <p>
                      <strong>Estado:</strong> {item.estado}
                    </p>
                  </div>
                  <div className="detailsReserva detall">
                    <p>
                      <strong>Reserva #:</strong> {reserva.id_reserva}
                    </p>
                    <p>
                      <strong>Fecha de Inicio:</strong>{" "}
                      {formatDate(fechaInicio)}{" "}
                      {/* Asegúrate de que `fechaInicio` proviene del objeto correcto */}
                    </p>
                    <p>
                      <strong>Fecha de Término:</strong> {formatDate(fechaFin)}{" "}
                      {/* Lo mismo para `fechaFin` */}
                    </p>
                    <p>
                      <strong>Total:</strong> {reserva.total}
                    </p>
                    <p>
                      <strong>Monto Reserva:</strong>{" "}
                      {reserva.monto_por_la_reserva}
                    </p>
                  </div>

                  <div className="moredetails detall">
                    {/* Bloque opcional para futuros detalles */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="inspeccionData">
            <div className="componentesExternos inpecData">
              <div className="modal-contentt">
                <h2>Inspeccion General</h2>
                <div className="accessories-list">
                  {accessories.map((accessory) => (
                    <div
                      key={accessory.id_equipo}
                      className="accessory-item"
                    >
                      <label>
                        <input
                          type="checkbox"
                          value={accessory.id_equipo}
                          onChange={(e) =>
                            handleAccessoryChange(e, accessory.id_equipo)
                          }
                          checked={selectedAccessories.includes(
                            accessory.id_equipo
                          )}
                        />
                        {accessory.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="inspection-options">
            <h3>Inspección</h3>
            <div>
              <label>
                Estado del Vehículo:
                <select>
                  <option value="Buen estado">Buen estado</option>
                  <option value="Con daños">Con daños</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Comentarios:
                <textarea
                  placeholder="Añade comentarios aquí"
                  value={obsevacion}
                  onChange={(e) => {
                    setObservacion(e.target.value);
                  }}
                ></textarea>
              </label>
            </div>
          </div>

          <div className="modal-buttons">
            <button className="btn-cancel" onClick={() => navigate("/login")}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn-submit"
              onClick={() => handleSubmit(id_vehiculo)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
