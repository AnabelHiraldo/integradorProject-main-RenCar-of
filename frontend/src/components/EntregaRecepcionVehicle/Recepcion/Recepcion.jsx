import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";
import "./Recepcion.css";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function Recepcion() {
  const [rentas, setRentas] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [version, setVersion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rentaSeleccionada, setrentaSeleccionada] = useState(null);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [recargarrentas, setRecargarrentas] = useState(false);
  const [filtros, setFiltros] = useState({
    cliente: "",
    vehiculo: "",
    id_renta: "",
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
    const fetchrentas = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/rent/rents/getWaiting/reception", {
          params: filtros,
        });

        const rentasAgrupadas = response.data.reduce((acc, renta) => {
          const existingRenta = acc.find(
            (r) => r.id_renta === renta.id_renta
          );

          if (existingRenta) {
            existingRenta.detalles.push({
              id_renta: renta.id_renta || null,
              id_vehiculo: renta.id_vehiculo || "Sin ID",
              id_version: renta.id_veersion || null,
              id_cliente: renta.id_cliente || null,
              marca: renta.marca || null,
              modelo: renta.modelo || null,
              version: renta.Veersion || null,
              color: renta.color || null,
              año: renta.año || null,
              fechaInicio: renta.fechaInicio || null,
              fechaFin: renta.fechaFin || null,
              id_marca: renta.id_marca || null,
              id_modelo: renta.id_modelo || null,
              id_veersion: renta.id_veersion || null,
              total: renta.total || null,
              precio: renta.precio || null,
              // monto_por_la_renta: renta.monto_por_la_renta || 0,
              total_detalle: renta.total_detalle || 0,
              puntos_canjeados: renta.puntos_canjeados || 0,
              // Origenrenta: renta.Origenrenta || 0,
              subTotal: renta.subTotal || 0,
              // fecharenta: renta.fecharenta || 0,
              imagen_url: renta.imagen_url || 0,
              placa: renta.placa || 0,
            });
          } else {
            acc.push({
              id_renta: renta.id_renta || "Sin renta",
              id_cliente: renta.id_cliente || null,
              cliente: renta.cliente || "Cliente Desconocido",
              total: renta.total || 0,
              subTotal: renta.subTotal || 0,
              // monto_por_la_renta: renta.monto_por_la_renta || 0,
              puntos_canjeados: renta.puntos_canjeados || 0,
              // Origenrenta: renta.Origenrenta || 0,
              // fecharenta: renta.fecharenta || 0,
              detalles: [
                {
                  id_renta: renta.id_renta || null,
                  id_vehiculo: renta.id_vehiculo || "Sin ID",
                  id_version: renta.id_veersion || null,
                  marca: renta.marca || null,
                  modelo: renta.modelo || null,
                  version: renta.Veersion || null,
                  color: renta.color || null,
                  año: renta.año || null,
                  fechaInicio: renta.fechaInicio || null,
                  fechaFin: renta.fechaFin || null,
                  id_marca: renta.id_marca || null,
                  id_modelo: renta.id_modelo || null,
                  id_veersion: renta.id_veersion || null,
                  precio: renta.precio || null,
                  total_detalle: renta.total_detalle || 0,
                  imagen_url: renta.imagen_url || 0,
                  placa: renta.placa || 0,
                },
              ],
            });
          }

          return acc;
        }, []);

        setRentas(rentasAgrupadas);
      } catch (error) {
        console.error("Error al obtener rentas:", error);
      }
      setLoading(false);
    };

    fetchrentas();

    if (recargarrentas) {
      setRecargarrentas(false);
    }
  }, [recargarrentas]);

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

  const handleModificarrenta = (renta) => {
    setrentaSeleccionada(renta);
    navigate("/RecepcionRenta", { state: { renta } });
    setModalIsOpen(true);
  };

  const handleGuardarCambios = async () => {
    try {
      console.log(rentaSeleccionada.id_renta);
      console.log(rentaSeleccionada);

      await axios.put(`http://localhost:3000/api/renta`, rentaSeleccionada);
      alert("renta actualizada con éxito");
      setrentaSeleccionada(null);
      setModalIsOpen(false);
      setRecargarrentas(true);
    } catch (error) {
      console.error("Error al actualizar la renta:", error);
      alert("Error al actualizar la renta");
    }
  };

  const handleFechaChange = (index, nuevaFechaInicio, nuevaFechaFin) => {
    const nuevarenta = JSON.parse(JSON.stringify(rentaSeleccionada));

    nuevarenta.detalles[index].fechaInicio = nuevaFechaInicio;
    nuevarenta.detalles[index].fechaFin = nuevaFechaFin;

    const nuevoTotal = nuevarenta.detalles.reduce((total, detalle) => {
      const fechaInicio = new Date(detalle.fechaInicio);
      const fechaFin = new Date(detalle.fechaFin);

      if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
        const dias = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
        return total + (detalle.precio * dias || 0);
      }

      return total;
    }, 0);

    setrentaSeleccionada({
      ...nuevarenta,
      total: nuevoTotal,
    });
  };

  const verificarDisponibilidad = async (index) => {
    const detalle = rentaSeleccionada.detalles[index];
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
                c.fechaIniciorenta || c.fechaInicioRenta
              )} hasta ${formatDate(c.fechaFinrenta || c.fechaFinRenta)}`
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
        <h1>rentas Activas</h1>
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
          <label className="label">renta</label>
          <input
            className="input"
            type="text"
            placeholder="Buscar por número de renta"
            name="id_renta"
            value={filtros.id_renta}
            onChange={(e) =>
              setFiltros({ ...filtros, id_renta: e.target.value })
            }
          />
        </div>
      </div>
      <div className="rentas-container">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          rentas.map((renta, index) => (
            <div
              key={`${renta.id_renta}-${index}`}
              className="renta-group"
            >
              <div className="clientDataReserv">
                <div className="rentaid topdata">
                  <h2>renta #{renta.id_renta}</h2>
                </div>
                <div className="nameClient topdata">
                  <p>
                    <strong>Cliente:</strong> {renta.cliente}
                  </p>
                </div>
                <div className="mounTotalrenta topdata">
                  <p>
                    <strong>Total:</strong> $ {renta.total.toFixed(2)}
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
                  {renta.detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={detalle.imagen_url}
                          alt={`Imagen de ${detalle.modelo || "vehículo"}`}
                          style={{
                           width:"150px",
                          height: "auto"
                          }}
                        
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
                    onClick={() => handleModificarrenta(renta)}
                  >
                    Recibir
                  </button>
                  {/* <button
                    className="buttonInsideModifier rec"
                    onClick={() =>
                      navigate("/entregaInspeccion", {
                        state: handleModificarrenta(renta),
                      })
                    } // Usando el ID en la URL
                  >
                    Recibir
                  </button> */}
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
        {rentaSeleccionada && <div className="div"></div>}
      </Modal> */}
    </div>
  );
}
