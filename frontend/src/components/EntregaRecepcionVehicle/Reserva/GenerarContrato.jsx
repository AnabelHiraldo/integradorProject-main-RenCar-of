import { jsPDF } from "jspdf";
import "jspdf-autotable";

const getImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const generarContratoPDF = async (reserva, details, cliente) => {
  const doc = new jsPDF("p", "pt", "letter");

  const fecha = new Date();
  const fechaFormateada = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}_${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}`;
  const nombreArchivo = `contrato_reserva_${reserva.id_reserva || "0"}_${fechaFormateada}.pdf`;

  const marginLeft = 40;
  const marginRight = 320; 
  let currentY = 60;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(0, 102, 204); // Azul
  doc.rect(10, 10, 570, 30, "F");
  doc.text("Contrato de Alquiler de Vehículo -- RentEasy", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

  // Información del Cliente
  currentY += 40;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Información del Cliente", marginLeft, currentY);

  doc.setFont("helvetica", "normal");
  const clienteInfo = [
    `Nombre: ${cliente?.nombre_cliente || "N/A"}`,
    `Correo: ${cliente?.correo_cliente || "N/A"}`,
    `Teléfono: ${cliente?.numero_telefono || "N/A"}`,
  ];

  let clienteY = currentY + 20;
  clienteInfo.forEach((line) => {
    doc.text(line, marginLeft, clienteY);
    clienteY += 15;
  });

  // Información del Vehículo
  doc.setFont("helvetica", "bold");
  doc.text("Información del Vehículo", marginRight, currentY);

  doc.setFont("helvetica", "normal");
  let vehiculoY = currentY + 20;
  details.forEach((detail) => {
    const vehiculoInfo = [
      `Marca: ${detail.marca || "N/A"}`,
      `Modelo: ${detail.modelo || "N/A"}`,
      `Versión: ${detail.version || "N/A"}`,
      `Placa: ${detail.placa || "N/A"}`,
      `Año: ${detail.año || "N/A"}`,
      `Color: ${detail.color || "N/A"}`,
    ];
    vehiculoInfo.forEach((line) => {
      doc.text(line, marginRight, vehiculoY);
      vehiculoY += 15;
    });
  });

  let finalY = Math.max(clienteY, vehiculoY) + 30;

  doc.setFont("helvetica", "bold");
  // doc.text("Imagen del Vehículo:", doc.internal.pageSize.getWidth() / 2, finalY, { align: "center" });
  finalY += 20;

  for (const detail of details) {
    if (detail.imagen_url) {
      try {
        const base64Image = await getImageAsBase64(detail.imagen_url);
        const imgWidth = 200; 
        const imgHeight = 200; 
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = (pageWidth - imgWidth) / 2;

        doc.setLineWidth(1);
        doc.setDrawColor(0, 0, 0);
        doc.rect(centerX - 2, finalY - 2, imgWidth + 4, imgHeight + 4); 

        doc.addImage(base64Image, "JPEG", centerX, finalY, imgWidth, imgHeight);
        finalY += imgHeight + 20;
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
        doc.text("Error al cargar la imagen del vehículo.", doc.internal.pageSize.getWidth() / 2, finalY, { align: "center" });
        finalY += 20;
      }
    }
  }

  doc.setFont("helvetica", "bold");
  doc.text("Términos y Condiciones", marginLeft, finalY);
  finalY += 20;

  doc.setFont("helvetica", "normal");
  const condiciones = [
    "1. El cliente se compromete a utilizar el vehículo de manera responsable.",
    "2. El cliente asume la responsabilidad por cualquier daño causado durante el periodo de alquiler.",
    "3. La empresa se reserva el derecho de terminar el contrato si se detecta uso indebido del vehículo.",
    "4. El cliente se compromete a devolver el vehículo en la fecha y hora acordadas.",
    "5. Cualquier incumplimiento puede resultar en cargos adicionales.",
  ];
  condiciones.forEach((line) => {
    doc.text(line, marginLeft, finalY);
    finalY += 15;
  });

  finalY += 40;
  doc.setFont("helvetica", "bold");
  doc.text("Firma del Cliente:", marginLeft, finalY);
  doc.line(marginLeft, finalY + 20, marginLeft + 200, finalY + 20);

  doc.text("Firma de la Empresa:", marginRight, finalY);
  doc.line(marginRight, finalY + 20, marginRight + 200, finalY + 20);

  finalY += 60;

  doc.setFont("helvetica", "italic");
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, marginLeft, finalY);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
  doc.save(nombreArchivo);
};
