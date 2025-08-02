import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


// OJO Anabel, tenemos que darle un buen formato y dinamizarlo 
const GenerarContrato = () => {
  // Datos de ejemplo
  const [cliente, setCliente] = useState({
    nombre: 'Juan Pérez',
    correo: 'juan.perez@email.com',
    direccion: 'Calle Ficticia 123, Ciudad, País',
  });

  const [reserva, setReserva] = useState({
    fechaInicio: '2024-12-10',
    fechaFin: '2024-12-15',
    tipoRenta: 'Renta diaria',
  });

  const [vehiculos, setVehiculos] = useState([
    { marca: 'Toyota', modelo: 'Corolla', matricula: 'ABC123' },
    { marca: 'Honda', modelo: 'Civic', matricula: 'DEF456' },
    { marca: 'Ford', modelo: 'Focus', matricula: 'GHI789' },
  ]);

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Contrato de Renta de Vehículo', 20, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${cliente.nombre}`, 20, 40);
    doc.text(`Correo electrónico: ${cliente.correo}`, 20, 50);
    doc.text(`Dirección: ${cliente.direccion}`, 20, 60);

    doc.text(`Fecha de inicio: ${reserva.fechaInicio}`, 20, 80);
    doc.text(`Fecha de fin: ${reserva.fechaFin}`, 20, 90);
    doc.text(`Tipo de renta: ${reserva.tipoRenta}`, 20, 100);

    doc.text('Vehículos involucrados:', 20, 120);

    doc.autoTable({
      startY: 130,
      head: [['Marca', 'Modelo', 'Matrícula']],
      body: vehiculos.map(vehiculo => [vehiculo.marca, vehiculo.modelo, vehiculo.matricula]),
    });

    doc.text('Firma del cliente: ________________________', 20, doc.lastAutoTable.finalY + 10);
    doc.text('Firma de la empresa: ________________________', 20, doc.lastAutoTable.finalY + 20);

    const pdfBlob = doc.output('blob');

    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, '_blank');
  };

  return (
    <div>
      <h2>Generar Contrato de Renta</h2>
      <button onClick={generarPDF}>Generar Contrato</button>
    </div>
  );
};

export default GenerarContrato;
