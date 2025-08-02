import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";
import "./EntregaRecepcion.css";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function EntregasRecepcion() {
  const [reservas, setRentas] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [version, setVersion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [recargarReservas, setRecargarReservas] = useState(false);
  const [filtros, setFiltros] = useState({
    cliente: "",
    vehiculo: "",
    id_reserva: "",
  });

  const navigate = useNavigate();

  const [filtroVehiculos, setFiltroVehiculos] = useState({
    marca: "",
    modelo: "",
    version: "",
    fechaInicio: "",
    fechaFin: "",
  });

  function handleVerifyng() {
    setIsVerifying(!isVerifying);
  }
  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getUTCFullYear();
    const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + d.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/reserva", {
          params: filtros,
        });

        const reservasAgrupadas = response.data.reduce((acc, reserva) => {
          const existingRenta = acc.find(
            (r) => r.id_reserva === reserva.id_reserva
          );

          if (existingRenta) {
            existingRenta.detalles.push({
              id_reserva: reserva.id_reserva || null,
              id_vehiculo: reserva.id_vehiculo || "Sin ID",
              id_version: reserva.id_veersion || null,
              id_cliente: reserva.id_cliente || null,
              marca: reserva.marca || null,
              modelo: reserva.modelo || null,
              version: reserva.Veersion || null,
              color: reserva.color || null,
              año: reserva.año || null,
              fechaInicio: reserva.fechaInicio || null,
              fechaFin: reserva.fechaFin || null,
              id_marca: reserva.id_marca || null,
              id_modelo: reserva.id_modelo || null,
              id_veersion: reserva.id_veersion || null,
              total: reserva.total || null,
              precio: reserva.precio || null,
              monto_por_la_reserva: reserva.monto_por_la_reserva || 0,
              total_detalle: reserva.total_detalle || 0,
              puntos_canjeados: reserva.puntos_canjeados || 0,
              OrigenReserva: reserva.OrigenReserva || 0,
              subTotal: reserva.subTotal || 0,
              fechaReserva: reserva.fechaReserva || 0,
              imagen_url: reserva.imagen_url || 0,
              placa: reserva.placa || 0,
            });
          } else {
            acc.push({
              id_reserva: reserva.id_reserva || "Sin Reserva",
              id_cliente: reserva.id_cliente || null,
              cliente: reserva.cliente || "Cliente Desconocido",
              total: reserva.total || 0,
              subTotal: reserva.subTotal || 0,
              monto_por_la_reserva: reserva.monto_por_la_reserva || 0,
              puntos_canjeados: reserva.puntos_canjeados || 0,
              OrigenReserva: reserva.OrigenReserva || 0,
              fechaReserva: reserva.fechaReserva || 0,
              detalles: [
                {
                  id_reserva: reserva.id_reserva || null,
                  id_vehiculo: reserva.id_vehiculo || "Sin ID",
                  id_version: reserva.id_veersion || null,
                  marca: reserva.marca || null,
                  modelo: reserva.modelo || null,
                  version: reserva.Veersion || null,
                  color: reserva.color || null,
                  año: reserva.año || null,
                  fechaInicio: reserva.fechaInicio || null,
                  fechaFin: reserva.fechaFin || null,
                  id_marca: reserva.id_marca || null,
                  id_modelo: reserva.id_modelo || null,
                  id_veersion: reserva.id_veersion || null,
                  precio: reserva.precio || null,
                  total_detalle: reserva.total_detalle || 0,
                  imagen_url: reserva.imagen_url || 0,
                  placa: reserva.placa || 0,
                },
              ],
            });
          }

          return acc;
        }, []);

        setRentas(reservasAgrupadas);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      }
      setLoading(false);
    };

    fetchReservas();

    if (recargarReservas) {
      setRecargarReservas(false);
    }
  }, [recargarReservas]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/brand").then((response) => {
      setBrand(response.data);
    });
  });
  const handleModel = (id_marca) => {
    axios
      .get(`http://localhost:3000/api/model/${id_marca}`)
      .then((response) => {
        response.data ? setModel(response.data) : "";
      });
  };

  const handleVersion = (id_modelo) => {
    axios
      .get(`http://localhost:3000/api/version/${id_modelo}`)
      .then((response) => {
        response.data ? setVersion(response.data) : "";
      });
  };

  const handleVehicle = (id_marca, id_modelo, id_version, fechaInicio) => {
    if (!id_marca || !id_modelo || !id_version || !fechaInicio) {
      console.error("Faltan parámetros:", {
        id_marca,
        id_modelo,
        id_version,
        fechaInicio,
      });
      return;
    }

    axios
      .get(
        `http://localhost:3000/api/vehicle/${id_marca}/${id_modelo}/${id_version}/${fechaInicio}`
      )
      .then((response) => {
        if (response.data) {
          setVehiculosDisponibles(response.data);
        } else {
          console.log("No se encontró ningún vehículo");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  };

  const handleModificarReserva = (reserva) => {
    setReservaSeleccionada(reserva);
    navigate("/entregaInspeccion", { state: { reserva } });
    setModalIsOpen(true);
  };

  const handleGuardarCambios = async () => {
    try {
      console.log(reservaSeleccionada.id_reserva);
      console.log(reservaSeleccionada);

      await axios.put(`http://localhost:3000/api/reserva`, reservaSeleccionada);
      alert("Reserva actualizada con éxito");
      setReservaSeleccionada(null);
      setModalIsOpen(false);
      setRecargarReservas(true);
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      alert("Error al actualizar la reserva");
    }
  };

  const handleFechaChange = (index, nuevaFechaInicio, nuevaFechaFin) => {
    const nuevaReserva = JSON.parse(JSON.stringify(reservaSeleccionada));

    nuevaReserva.detalles[index].fechaInicio = nuevaFechaInicio;
    nuevaReserva.detalles[index].fechaFin = nuevaFechaFin;

    const nuevoTotal = nuevaReserva.detalles.reduce((total, detalle) => {
      const fechaInicio = new Date(detalle.fechaInicio);
      const fechaFin = new Date(detalle.fechaFin);

      if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
        const dias = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
        return total + (detalle.precio * dias || 0);
      }

      return total;
    }, 0);

    setReservaSeleccionada({
      ...nuevaReserva,
      total: nuevoTotal,
    });
  };

  const verificarDisponibilidad = async (index) => {
    const detalle = reservaSeleccionada.detalles[index];
    const { id_vehiculo, fechaInicio, fechaFin } = detalle;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/vehicle/${id_vehiculo}/${fechaInicio}/${fechaFin}`
      );

      if (response.data.disponible) {
        alert("El vehículo está disponible.");
        setIsVerifying(false);
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

        alert(
          `El vehículo no está disponible. Conflictos encontrados:\n${conflictosDetalles}`
        );
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      alert(
        "Ocurrió un error al verificar la disponibilidad. Intente nuevamente."
      );
    }
  };

  return (
    <div className="SectioEntregasAndReception">
      <div className="title">
        <h1>Reservas Activas</h1>
      </div>
      <div className="group">
        <div className="field">
          <label className="label">Cliente</label>
          <input
            className="input"
            type="text"
            placeholder="Buscar por cliente"
            name="cliente"
            value={filtros.cliente}
            onChange={(e) =>
              setFiltros({ ...filtros, cliente: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label className="label">Vehículo</label>
          <input
            className="input"
            type="text"
            placeholder="Buscar por vehículo"
            name="vehiculo"
            value={filtros.vehiculo}
            onChange={(e) =>
              setFiltros({ ...filtros, vehiculo: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label className="label">Reserva</label>
          <input
            className="input"
            type="text"
            placeholder="Buscar por número de reserva"
            name="id_reserva"
            value={filtros.id_reserva}
            onChange={(e) =>
              setFiltros({ ...filtros, id_reserva: e.target.value })
            }
          />
        </div>
      </div>
      <div className="reservas-container">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          reservas.map((reserva, index) => (
            <div
              key={`${reserva.id_reserva}-${index}`}
              className="reserva-group"
            >
              <div className="clientDataReserv">
                <div className="reservaid topdata">
                  <h2>Reserva #{reserva.id_reserva}</h2>
                </div>
                <div className="nameClient topdata">
                  <p>
                    <strong>Cliente:</strong> {reserva.cliente}
                  </p>
                </div>
                <div className="mounTotalReserva topdata">
                  <p>
                    <strong>Total:</strong> $ {reserva.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Vehiculo</th>
                    {/* <th>ID Vehículo</th> */}
                    {/* <th>ID Version</th> */}
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
                  {reserva.detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={detalle.imagen_url}
                          alt={`Imagen de ${detalle.modelo || "vehículo"}`}
                          width="100"
                          height="auto"
                        />
                      </td>{" "}
                      {/* <td>{detalle.id_vehiculo}</td> */}
                      {/* <td>{detalle.id_version}</td> */}
                      <td>{detalle.marca}</td>
                      <td>{detalle.modelo}</td>
                      <td>{detalle.version}</td>
                      <td>{detalle.color}</td>
                      <td>{detalle.año}</td>
                      <td>{detalle.precio}</td>
                      <td>{formatDate(detalle.fechaInicio)}</td>
                      <td>{formatDate(detalle.fechaFin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="buttomModifier">
                <div className="contentButtonRight">
                  <button
                    className="buttonInsideModifier ent"
                    onClick={() => handleModificarReserva(reserva)}
                  >
                    Entregar
                  </button>
                  <button
                    className="buttonInsideModifier rec"
                    onClick={() =>
                      navigate("/entregaInspeccion", {
                        state: handleModificarReserva(reserva),
                      })
                    } // Usando el ID en la URL
                  >
                    Recibir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="ReactModal__Contenttt"
        overlayClassName="ReactModal__OverlayEntrega"
      >
        {reservaSeleccionada && <div className="div"></div>}
      </Modal> */}
    </div>
  );
}
