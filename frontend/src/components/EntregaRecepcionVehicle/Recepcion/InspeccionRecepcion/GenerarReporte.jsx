import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generarPDF = (renta, selectedVehicle, damages) => {
  const doc = new jsPDF("p", "pt", "letter");

  const fecha = new Date();
  const fechaFormateada = `${fecha.getFullYear()}-${
    fecha.getMonth() + 1
  }-${fecha.getDate()}_${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}`;
  const nombreArchivo = `reporte_renta_${renta.id_renta || "0"}_${fechaFormateada}.pdf`;

  doc.setFillColor(0, 102, 204); // Azul
  doc.rect(10, 10, 580, 40, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Reporte de Inspección del Vehículo", doc.internal.pageSize.getWidth() / 2, 35, { align: "center" });

  const marginLeft = 40;
  const marginRight = 320;
  let currentY = 80;

  // Información del Cliente
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Información del Cliente:", marginLeft, currentY);
  currentY += 20;

  doc.setFont("helvetica", "normal");
  const clientInfo = [
    `Cliente: ${renta.cliente || "N/A"}`,
    `ID Renta: ${renta.id_renta || "N/A"}`,
    `Observaciones: ${renta.observacion || "Sin observaciones"}`,
  ];
  clientInfo.forEach((line) => {
    doc.text(line, marginLeft + 10, currentY);
    currentY += 15;
  });

  // Información del Vehículo
  doc.setFont("helvetica", "bold");
  doc.text("Información del Vehículo:", marginRight, 80);

  let vehiculoY = 100;
  doc.setFont("helvetica", "normal");
  const vehicleInfo = [
    `Marca: ${selectedVehicle.details.marca || "N/A"}`,
    `Modelo: ${selectedVehicle.details.modelo || "N/A"}`,
    `Matrícula: ${selectedVehicle.details.placa || "N/A"}`,
    `Kilometraje: ${selectedVehicle.details.kilometraje_actual || "N/A"} km`,
  ];
  vehicleInfo.forEach((line) => {
    doc.text(line, marginRight + 10, vehiculoY);
    vehiculoY += 15;
  });

  currentY = Math.max(currentY, vehiculoY) + 20;

  doc.setFont("helvetica", "bold");
  doc.text("Detalles de Daños:", marginLeft, currentY);
  doc.autoTable({
    startY: currentY + 10,
    headStyles: { fillColor: [52, 58, 64], textColor: 255 },
    bodyStyles: { textColor: 0 },
    head: [["Parte del Vehículo", "Tipo de Daño", "Gravedad", "Observaciones"]],
    body: damages.map((damage) => [
      damage.id_parte.label || "N/A",
      damage.id_tipo_daño.label || "N/A",
      damage.id_gravedad.label || "N/A",
      damage.observaciones || "Sin observaciones",
    ]),
  });

  currentY = doc.lastAutoTable.finalY + 20;
  if (damages.some((damage) => damage.imagen_url)) {
    doc.setFont("helvetica", "bold");
    doc.text("Imágenes de Daños:", marginLeft, currentY);
    currentY += 10;

    damages.forEach((damage) => {
      if (damage.imagen_url) {
        const image = new Image();
        image.src = URL.createObjectURL(damage.imagen_url);
        doc.addImage(image, "JPEG", marginLeft, currentY, 100, 75);

        doc.setFont("helvetica", "normal");
        doc.text(`Parte: ${damage.id_parte.label || "N/A"}`, 150, currentY + 20);
        doc.text(`Tipo de daño: ${damage.id_tipo_daño.label || "N/A"}`, 150, currentY + 40);
        doc.text(`Observación: ${damage.observaciones || "Sin observaciones"}`, 150, currentY + 60);

        currentY += 90; 
      }
    });
  }

  currentY += 40;
  doc.setFont("helvetica", "bold");
  doc.text("Firma del Cliente:", marginLeft, currentY);
  doc.line(marginLeft, currentY + 20, marginLeft + 200, currentY + 20);

  doc.text("Firma del Inspector:", marginRight, currentY);
  doc.line(marginRight, currentY + 20, marginRight + 200, currentY + 20);

  currentY += 50;

  doc.setFont("helvetica", "italic");
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() / 2, currentY, { align: "center" });

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
  doc.save(nombreArchivo);
};
