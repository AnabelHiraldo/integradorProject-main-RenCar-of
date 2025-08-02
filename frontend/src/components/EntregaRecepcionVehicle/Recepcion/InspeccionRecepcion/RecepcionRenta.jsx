import axios from "axios";
import "./RecepcionRenta.css";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage, Field } from "formik";
import Select from "react-select";
// import GenerarReporte from "./GenerarReporte";
import { generarPDF } from "./GenerarReporte";


export default function RecepcionRenta() {
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [formData, setFormData] = useState({});
  const [obsevacion, setObservacion] = useState("");
  const [entregaDir, setEntregaDir] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [vehicleParts, setVehicleParts] = useState([]);
  const [tipoDaño, setTipoDaño] = useState([]);
  const [gravedad, setGravedad] = useState([]);
  const [damages, setDamages] = useState([]);
  const [currentDamage, setCurrentDamage] = useState({
    id_tipo_daño: null,
    id_parte: null,
    id_gravedad: null,
    observaciones: "",
    imagen_url: null,
  });

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getUTCFullYear();
    const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + d.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/InspeccionEntrega")
      .then((response) => {
        setAccessories(response.data);
      });
    axios.get("http://localhost:3000/api/vehicleParts").then((response) => {
      setVehicleParts(response.data);
      console.log(response.data);
    });
    axios.get("http://localhost:3000/api/tipoDamage").then((response) => {
      setTipoDaño(response.data);
      console.log(response.data);
    });
    axios.get("http://localhost:3000/api/gravedad").then((response) => {
      setGravedad(response.data);
      console.log(response.data);
    });
    
  }, []);

  const navigate = useNavigate();

  const handleAccessoryChange = (e, accessoryID) => {
    if (e.target.checked) {
      setSelectedAccessories((prevSelected) => [...prevSelected, accessoryID]);
    } else {
      setSelectedAccessories((prevSelected) =>
        prevSelected.filter((id) => id != accessoryID)
      );
    }
  };

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
  // const handleSubmit = async (id_vehiculo) => {
  //   const dataToSend = damages.map((damage) => ({
  //     id_tipo_daño: damage.id_tipo_daño.value,
  //     id_parte: damage.id_parte.value,
  //     observaciones: damage.observaciones,
  //     imagen_url: damage.imagen_url,
  //   }));

  //   try {
  //     await axios.post("http://localhost:3000/api/InspeccionEntrega", { damages: dataToSend });
  //     alert("Datos enviados exitosamente");
  //   } catch (error) {
  //     console.error("Error al enviar los datos:", error);
  //   }
  // };

  const handleSubmit = async (id_vehiculo) => {
    const formData = new FormData();
  
    formData.append("id_vehiculo", id_vehiculo);
    formData.append("id_renta", renta.id_renta);
    formData.append("id_cliente", renta.id_cliente);
    formData.append("id_entrega_recepcion_inspeccion", id_entrega_recepcion?.id_entrega_recepcion_inspeccion);
    formData.append("Observaciones", obsevacion);
    formData.append("subTotal", renta.subTotal);
    formData.append("total", renta.subTotal);
    formData.append("detalles", JSON.stringify(details));
    formData.append("puntos_canjeados", renta.puntos_canjeados);
    formData.append("selectedAccessories", JSON.stringify(selectedAccessories));
  
    damages.forEach((damage, index) => {
      formData.append(`damages[${index}][id_vehiculo]`, selectedVehicle.details.id_vehiculo);
      formData.append(`damages[${index}][id_tipo_daño]`, damage.id_tipo_daño.value);
      formData.append(`damages[${index}][id_graveda]`, damage.id_gravedad.value);
      formData.append(`damages[${index}][id_parte_vehiculo]`, damage.id_parte.value);
      formData.append(`damages[${index}][observaciones]`, damage.observaciones);
      if (damage.imagen_url) {
        formData.append(`images`, damage.imagen_url); // Ajuste clave
      }
    });
  
    try {
      const response = await axios.post("http://localhost:3000/api/inspeccionRecepcion", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // alert("Datos enviados exitosamente");
      // console.log("Respuesta del servidor:", response.data);
      generarPDF(renta, selectedVehicle, damages);

    
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };
  

  

  const handleAddDamage = () => {
    if (!currentDamage.id_tipo_daño || !currentDamage.id_parte) {
      alert("Debe seleccionar la parte afectada y el tipo de daño.");
      return;
    }
    setDamages((prev) => [...prev, currentDamage]);
    setCurrentDamage({
      id_vehiculo: null,
      id_tipo_daño: null,
      id_parte: null,
      observaciones: "",
      imagen_url: null,
    });
  };

  const handleRemoveDamage = (index) => {
    setDamages((prev) => prev.filter((_, i) => i !== index));
  };

  const location = useLocation();
  const renta = location.state?.renta;
  const details = location.state.renta.detalles;

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState({});

  const handleVehicleSelect = (selectedOption) => {
    setSelectedVehicle(selectedOption);
    setVehicleDetails(selectedOption?.details || {});
  };
  const [id_entrega_recepcion, setIdEntregaRecepcion] = useState(0)

  useEffect(()=>{
    const id_renta = renta.id_renta
    if(selectedVehicle){
      axios.get(`http://localhost:3000/api/inspeccionRecepcion/get/getEntregaByRent`,{
        params: {id_renta},
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response)=>{
        setIdEntregaRecepcion(response.data)
        console.log(response.data)
      })
    }
  
 }, [selectedVehicle])

  // useEffect(() => {
  //   if (renta) {
  //     console.log(renta);
  //     console.log(details);
  //     // handleEntregaDireccion(renta.id_renta)

  //     // alert(JSON.stringify(renta, null, 2));
  //     const id = renta.id_renta;
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
  // }, [renta]);

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
      <div className="sectionReceptionRenta">
        <div className="sectionReceptionInside">
          <div className="vehicle-selection">
            <h3>Seleccionar Vehículo</h3>
            <Select
              options={details.map((detalle) => ({
                value: detalle.id_vehiculo,
                label: `${detalle.modelo} (${detalle.placa})`,
                details: detalle,
              }))}
              placeholder="Seleccione un vehículo"
              isClearable
              onChange={handleVehicleSelect}
            />
          </div>

          {selectedVehicle && (
            <div className="modal-content">
              <div className="modal-header">
                <div className="vehicle-info">
                  <img
                    src={vehicleDetails.imagen_url}
                    alt="Imagen del vehículo"
                    className="vehicle-image"
                  />
                  <div className="vehicle-details">
                    <p>
                      <strong>Modelo:</strong> {vehicleDetails.modelo}
                    </p>
                    <p>
                      <strong>Placa:</strong> {vehicleDetails.placa}
                    </p>
                    <p>
                      <strong>Año:</strong> {vehicleDetails.año}
                    </p>
                    <p>
                      <strong>Color:</strong> {vehicleDetails.color}
                    </p>
                  </div>
                </div>

                <div className="extra_info">
                  <div className="detailsClient detall">
                    <p>
                      <strong>Cliente:</strong> {renta.cliente}
                    </p>
                    <p>
                      <strong>Fecha de renta:</strong>{" "}
                      {new Date(renta.fecharenta).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Duración:</strong> {vehicleDetails.duracion} días
                    </p>
                    <p>
                      <strong>Estado:</strong> {vehicleDetails.estado}
                    </p>
                  </div>
                  <div className="detailsrenta detall">
                    <p>
                      <strong>renta #:</strong> {renta.id_renta}
                    </p>
                    <p>
                      <strong>Fecha de Inicio:</strong>{" "}
                      {new Date(
                        vehicleDetails.fechaInicio
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Fecha de Término:</strong>{" "}
                      {new Date(vehicleDetails.fechaFin).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Total:</strong> {renta.total}
                    </p>
                    <p>
                      <strong>Monto renta:</strong>{" "}
                      {renta.monto_por_la_renta}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="inspeccionData">
            <div className="componentesExternos inpecData">
              <div className="modal-contentt">
                <h2>Inspeccion General</h2>
                <div className="accessories-list">
                  {accessories.map((accessory) => (
                    <div key={accessory.id_equipo} className="accessory-item">
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

          <div className="inspection-options">
            <h3>Reporte de Daños</h3>
            <div className="group">
              {/* Campo para la Parte Afectada */}
              <div className="field">
                <label className="label">Parte afectada</label>
                <div className="control">
                  <Select
                    options={vehicleParts.map((state) => ({
                      value: state.id_parte,
                      label: state.nombre,
                    }))}
                    placeholder="Seleccione la parte afectada"
                    name="id_parte"
                    isSearchable
                    isClearable
                    value={currentDamage.id_parte}
                    onChange={(selectedOption) =>
                      setCurrentDamage((prev) => ({
                        ...prev,
                        id_parte: selectedOption,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Campo para el Tipo de Daño */}
              <div className="field">
                <label className="label">Tipo de daño</label>
                <div className="control">
                  <Select
                    options={tipoDaño.map((state) => ({
                      value: state.id_tipo_daño,
                      label: state.nombre,
                    }))}
                    placeholder="Seleccione el tipo de daño"
                    name="id_tipo_daño"
                    isSearchable
                    isClearable
                    value={currentDamage.id_tipo_daño}
                    onChange={(selectedOption) =>
                      setCurrentDamage((prev) => ({
                        ...prev,
                        id_tipo_daño: selectedOption,
                      }))
                    }
                  />
                </div>
              </div>
                {/* Campo para el Tipo de gravedad */}
                <div className="field">
                <label className="label">Tipo de gravedad</label>
                <div className="control">
                  <Select
                    options={gravedad.map((state) => ({
                      value: state.id_gravedad,
                      label: state.nombre,
                    }))}
                    placeholder="Seleccione el tipo de daño"
                    name="id_tipo_daño"
                    isSearchable
                    isClearable
                    value={currentDamage.id_gravedad}
                    onChange={(selectedOption) =>
                      setCurrentDamage((prev) => ({
                        ...prev,
                        id_gravedad: selectedOption,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Campo para la Observación */}
              <div className="field">
                <label className="label">Observación</label>
                <div className="control">
                  <textarea
                    style={{ height: "40px" }}
                    placeholder="Describa el daño"
                    value={currentDamage.observaciones}
                    onChange={(e) =>
                      setCurrentDamage((prev) => ({
                        ...prev,
                        observaciones: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Campo para la Imagen */}
              <div className="field">
                <label className="label">Imagen</label>
                <div className="control">
                  <input
                    className="input"
                    type="file"
                    name="imagen"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setCurrentDamage((prev) => ({
                        ...prev,
                        imagen_url: file,
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Botón para Añadir el Daño */}
              <div className="field">
                <div className="control">
                  <button
                    type="button"
                    className="button-guardar"
                    onClick={() => {
                      if (
                        !selectedVehicle ||
                        !currentDamage.id_parte ||
                        !currentDamage.id_tipo_daño
                      ) {
                        alert(
                          "Debe seleccionar un vehículo, la parte afectada y el tipo de daño."
                        );
                        return;
                      }
                      setDamages((prev) => [
                        ...prev,
                        {
                          ...currentDamage,
                          id_vehiculo: selectedVehicle.value,
                        },
                      ]);
                      setCurrentDamage({
                        id_tipo_daño: null,
                        id_parte: null,
                        observaciones: "",
                        imagen_url: null,
                      });
                    }}
                  >
                    Añadir Daño
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla para Mostrar los Daños */}
            <div className="tableDetails">
              <table>
                <thead>
                  <tr>
                    <th>ID Vehículo</th>
                    <th>Parte Afectada</th>
                    <th>Tipo de Daño</th>
                    <th>Tipo de Gravedad</th>
                    <th>Observación</th>
                    <th>Imagen</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {damages.map((damage, index) => (
                    <tr key={index}>
                      <td>{damage.id_vehiculo}</td>
                      <td>{damage.id_parte?.label}</td>
                      <td>{damage.id_tipo_daño?.label}</td>
                      <td>{damage.id_gravedad?.label}</td>
                      <td>{damage.observaciones}</td>
                      <td>
                        {damage.imagen_url ? (
                          <img
                            src={URL.createObjectURL(damage.imagen_url)}
                            alt="Daño"
                            style={{
                              width:"150px",
                             height: "auto"
                             }}                          />
                        ) : (
                          "Sin imagen"
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            setDamages((prev) =>
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
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    );
  }
}
