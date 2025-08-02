import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CancelarReserva.css"

export default function CancelarReserva({ idReserva, cliente }) {
  const [razones, setRazones] = useState([]);
  const [selectedRazon, setSelectedRazon] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [penalidad, setPenalidad] = useState(0);

  useEffect(() => {
    // axios.get("/api/razones-cancelacion").then((response) => {
    //   setRazones(response.data);
    // });

    // // Calcular penalidad inicial para toda la reserva
    // calcularPenalidad();
  }, []);

  const calcularPenalidad = async () => {
    try {
      const response = await axios.get(`/api/calcular-penalidad-reserva/${idReserva}`);
      setPenalidad(response.data.penalidad);
    } catch (error) {
      console.error("Error al calcular la penalidad:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRazon) {
      alert("Por favor, selecciona una razón de cancelación.");
      return;
    }

    const dataToSend = {
      id_reserva: idReserva,
      id_cliente: cliente.id_cliente,
      id_razon: selectedRazon,
      observaciones,
    };

    try {
      await axios.post("/api/cancelar-reserva", dataToSend);
      alert("Cancelación realizada con éxito.");
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  return (
    <div className="cancelar-reserva-form">
      <h2>Cancelar Reserva</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="razon">Razón de Cancelación</label>
          <select
            id="razon"
            value={selectedRazon}
            onChange={(e) => setSelectedRazon(e.target.value)}
          >
            <option value="">-- Selecciona una razón --</option>
            {razones.map((razon) => (
              <option key={razon.id_razon} value={razon.id_razon}>
                {razon.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones (Opcional)</label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Añade detalles sobre la cancelación..."
          />
        </div>

        <div className="form-group">
          <p>
            <strong>Penalidad Estimada:</strong> ${penalidad.toFixed(2)}
          </p>
        </div>

        <button type="submit" className="btn-cancelar">
          Confirmar Cancelación
        </button>
      </form>
    </div>
  );
}
