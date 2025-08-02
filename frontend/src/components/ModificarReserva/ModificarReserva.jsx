import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";
import "./ModificarReserva.css";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

export default function ReservasActivas() {
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
            });
          } else {
            acc.push({
              id_reserva: reserva.id_reserva || "Sin Renta",
              cliente: reserva.cliente || "Cliente Desconocido",
              total: reserva.total || 0,
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
                  total: reserva.total || null,
                  precio: reserva.precio || null,
                },
              ],
            });
          }

          return acc;
        }, []);

        setRentas(reservasAgrupadas);
        console.log(reservasAgrupadas);
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
      console.log(response.data);
      if (response.data.disponible) {
        Swal.fire({
          title: "RentEasy Alert",
          text: "El vehículo está disponible.",
          icon: "success",
        });
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

        Swal.fire({
          title: "RentEasy Alert",
          text: `El vehículo no está disponible. Conflictos encontrados:\n${conflictosDetalles}`,
          icon: "success",
        });
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
    <div className="SectioModificarReservas">
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
              <h2>Reserva #{reserva.id_reserva}</h2>
              <p>
                <strong>Cliente:</strong> {reserva.cliente}
              </p>
              <p>
                <strong>Total:</strong> $ {reserva.total.toFixed(2)}
              </p>
              <div className="buttomModifier">
                <button
                  className="buttonInsideModifier"
                  onClick={() => handleModificarReserva(reserva)}
                >
                  Modificar Reserva
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID Vehículo</th>
                    <th>ID Version</th>
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
                      <td>{detalle.id_vehiculo}</td>
                      <td>{detalle.id_version}</td>
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
            </div>
          ))
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="ReactModal__Contenttt"
        overlayClassName="ReactModal__Overlayy"
      >
        {reservaSeleccionada && (
          <div className="modal-content">
            <h2>Modificar Reserva #{reservaSeleccionada.id_reserva}</h2>
            <h3>Vehículos actuales en la reserva</h3>
            <table>
              <thead>
                <tr>
                  <th>ID Vehículo</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Versión</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Verificar</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservaSeleccionada.detalles.map((detalle, index) => {
                  const precio = detalle.precio || 0;
                  const fechaInicio = detalle.fechaInicio
                    ? new Date(detalle.fechaInicio)
                    : null;
                  const fechaFin = detalle.fechaFin
                    ? new Date(detalle.fechaFin)
                    : null;

                  const diasReserva =
                    fechaInicio && fechaFin
                      ? (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)
                      : 0;

                  // Calculamos el total de la reserva directamente en el filtro de eliminación
                  return (
                    <tr key={index}>
                      <td>{detalle.id_vehiculo}</td>
                      <td>{detalle.marca}</td>
                      <td>{detalle.modelo}</td>
                      <td>{detalle.version}</td>
                      <td>
                        <input
                          type="date"
                          value={formatDate(detalle.fechaInicio)}
                          onChange={(e) => {
                            const nuevaFechaInicio = e.target.value;

                            handleFechaChange(
                              index,
                              nuevaFechaInicio,
                              detalle.fechaFin
                            );

                            if (nuevaFechaInicio && detalle.fechaFin) {
                              console.log(
                                "Procesando validación con nueva fecha de inicio:",
                                nuevaFechaInicio
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={formatDate(detalle.fechaFin)}
                          onChange={(e) => {
                            const nuevaFechaFin = e.target.value;

                            handleFechaChange(
                              index,
                              detalle.fechaInicio,
                              nuevaFechaFin
                            );

                            if (nuevaFechaFin && detalle.fechaInicio) {
                              console.log(
                                "Procesando validación con nueva fecha de fin:",
                                nuevaFechaFin
                              );
                            }
                          }}
                        />
                      </td>

                      <td>
                        <button
                          onClick={() => {
                            verificarDisponibilidad(index);
                            handleVerifyng();
                          }}
                          disabled={isVerifying}
                        >
                          {isVerifying
                            ? "Verificando..."
                            : "Verificar disponibilidad"}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            const detallesActualizados =
                              reservaSeleccionada.detalles.filter(
                                (_, i) => i !== index
                              );

                            const nuevoTotal = detallesActualizados.reduce(
                              (total, d) => {
                                const fechaInicio = new Date(d.fechaInicio);
                                const fechaFin = new Date(d.fechaFin);

                                if (
                                  !isNaN(fechaInicio.getTime()) &&
                                  !isNaN(fechaFin.getTime())
                                ) {
                                  const dias =
                                    (fechaFin - fechaInicio) /
                                    (1000 * 60 * 60 * 24);
                                  return total + (d.precio * dias || 0);
                                }

                                return total;
                              },
                              0
                            );

                            setReservaSeleccionada((prev) => ({
                              ...prev,
                              detalles: detallesActualizados,
                              total: nuevoTotal,
                            }));
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h3>Total Actualizado: $ {reservaSeleccionada.total.toFixed(2)}</h3>
            <h3>Filtrar Vehículos Disponibles</h3>
            <div className="group">
              <div className="field">
                <label className="label">Fecha de Inicio</label>
                <input
                  type="date"
                  value={filtroVehiculos.fechaInicio || ""}
                  onChange={(e) =>
                    setFiltroVehiculos((prev) => ({
                      ...prev,
                      fechaInicio: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Fecha Final</label>
                <input
                  type="date"
                  value={filtroVehiculos.fechaFin || ""}
                  onChange={(e) =>
                    setFiltroVehiculos((prev) => ({
                      ...prev,
                      fechaFin: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Marca</label>
                <div className="control">
                  <Select
                    options={brand.map((brandd) => ({
                      value: brandd.id_marca,
                      label: brandd.marca,
                    }))}
                    placeholder="Seleccione la marca"
                    isClearable
                    isSearchable
                    value={
                      filtroVehiculos.marca
                        ? {
                            value: filtroVehiculos.marca,
                            label:
                              brand.find(
                                (item) =>
                                  item.id_marca === filtroVehiculos.marca
                              )?.marca || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setFiltroVehiculos((prev) => ({
                          ...prev,
                          marca: selectedOption.value,
                        }));
                        handleModel(selectedOption.value); // Actualizar los modelos
                      } else {
                        setFiltroVehiculos((prev) => ({ ...prev, marca: "" }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Modelo</label>
                <Select
                  options={model.map((modelItem) => ({
                    value: modelItem.id_modelo,
                    label: modelItem.modelo,
                  }))}
                  placeholder="Seleccione el modelo"
                  isClearable
                  isSearchable
                  value={
                    filtroVehiculos.modelo
                      ? {
                          value: filtroVehiculos.modelo,
                          label:
                            model.find(
                              (item) =>
                                item.id_modelo === filtroVehiculos.modelo
                            )?.modelo || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFiltroVehiculos((prev) => ({
                        ...prev,
                        modelo: selectedOption.value,
                      }));
                      handleVersion(selectedOption.value); // Actualizar las versiones
                    } else {
                      setFiltroVehiculos((prev) => ({ ...prev, modelo: "" }));
                    }
                  }}
                />
              </div>

              <div className="field">
                <label className="label">Versión</label>
                <Select
                  options={version.map((versionItem) => ({
                    value: versionItem.id_veersion,
                    label: versionItem.veersion,
                  }))}
                  placeholder="Seleccione la versión"
                  isClearable
                  isSearchable
                  value={
                    filtroVehiculos.version
                      ? {
                          value: filtroVehiculos.version,
                          label:
                            version.find(
                              (item) =>
                                item.id_veersion === filtroVehiculos.version
                            )?.veersion || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFiltroVehiculos((prev) => ({
                      ...prev,
                      version: selectedOption?.value || "",
                    }));
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                handleVehicle(
                  filtroVehiculos.marca,
                  filtroVehiculos.modelo,
                  filtroVehiculos.version,
                  filtroVehiculos.fechaInicio
                );
                console.log(filtroVehiculos.marca);
                console.log(filtroVehiculos.modelo);
                console.log(filtroVehiculos.version);
              }}
            >
              Filtrar
            </button>
            <h3>Vehículos disponibles</h3>
            <table className="dispVehicle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Color</th>
                  <th>Año</th>
                  <th>Precio x Día</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosDisponibles.map((vehiculo) => (
                  <tr key={vehiculo.id_vehiculo}>
                    <td>{vehiculo.id_vehiculo}</td>
                    <td>{vehiculo.marca}</td>
                    <td>{vehiculo.modelo}</td>
                    <td>{vehiculo.color}</td>
                    <td>{vehiculo.año}</td>
                    <td>
                      ${vehiculo.precio ? vehiculo.precio.toFixed(2) : "0.00"}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          const nuevoVehiculo = {
                            id_vehiculo: vehiculo.id_vehiculo,
                            marca: vehiculo.marca,
                            modelo: vehiculo.modelo,
                            version: vehiculo.veersion,
                            fechaInicio: filtroVehiculos.fechaInicio || "",
                            fechaFin: filtroVehiculos.fechaFin || "",
                            precio: vehiculo.precio,
                          };
                          setReservaSeleccionada((prev) => {
                            const vehiculoYaExiste = prev.detalles.some(
                              (detalle) =>
                                detalle.id_vehiculo ===
                                nuevoVehiculo.id_vehiculo
                            );

                            let nuevosDetalles;

                            if (vehiculoYaExiste) {
                              nuevosDetalles = prev.detalles;
                            } else {
                              nuevosDetalles = [
                                ...prev.detalles,
                                nuevoVehiculo,
                              ];
                            }

                            const nuevoTotal = nuevosDetalles.reduce(
                              (total, d) => {
                                const fechaInicio = new Date(d.fechaInicio);
                                const fechaFin = new Date(d.fechaFin);

                                if (
                                  !isNaN(fechaInicio.getTime()) &&
                                  !isNaN(fechaFin.getTime())
                                ) {
                                  const dias =
                                    (fechaFin - fechaInicio) /
                                    (1000 * 60 * 60 * 24);

                                  let resultTotal;

                                  if (dias > 0) {
                                    resultTotal =
                                      total + (d.precio * dias || 0);
                                  } else {
                                    resultTotal = total + d.precio;
                                  }

                                  return resultTotal || 0;
                                }

                                return total;
                              },
                              0
                            );

                            console.log(nuevoTotal);

                            return {
                              ...prev,
                              detalles: nuevosDetalles,
                              total: nuevoTotal,
                            };
                          });
                        }}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="buttonAccion">
              <button
                className="ButtonSaveChange"
                onClick={handleGuardarCambios}
              >
                Guardar Cambios
              </button>
              <button
                className="ButtonCancelar"
                onClick={() => {
                  setModalIsOpen(false);
                  setReservaSeleccionada(null);
                  setVehiculosDisponibles([]);
                  setFiltroVehiculos([]);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
