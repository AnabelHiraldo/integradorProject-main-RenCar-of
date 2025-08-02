const email = {};

const nodemailer = require("nodemailer");

email.create = async (req, res) => {
  try {
    const { emaill, text } = req.body;

    if (!emaill || !text) {
      return res
        .status(400)
        .json({ message: "Correo electrónico o detalles no proporcionados" });
    }
    
    const arrayOrder = text.map((detalle) => ({
      año: detalle.año,
      capacidadPersonas: detalle.capacidadPersonas,
      color: detalle.color,
      modelo: detalle.modelo,
      nombreCliente: detalle.nombreCliente,
      precio: detalle.precio,
      total: detalle.total,
      fechaInicio: detalle.fechaInicio,
      fechaFin: detalle.fechaFin,
    }));
    console.log(arrayOrder);

    const montoTotal = arrayOrder.reduce(
      (total, detalle) => total + detalle.total,
      0
    );

    //En caso de que falle, es porque le quite las comas al mensaje, cualquier cosa probamos de nuevo
    const mensajeCorreoConTotal = `
    Estimado ${arrayOrder[0]?.nombreCliente || "cliente"},
    
    A continuación, los detalles de su reserva:
    
    ${arrayOrder
      .map(
        (detalle, index) =>
          `${index + 1}. 
         Vehículo: ${detalle.modelo}
         Año: ${detalle.año}
         Color: ${detalle.color}
         Capacidad: ${detalle.capacidadPersonas} personas
         Precio por día: $${detalle.precio}
         Total: $${detalle.total}
         Desde: ${detalle.fechaInicio} 
         Hasta: ${detalle.fechaFin}`
      )
      .join("\n")}
    
    Monto total de la reserva: $${montoTotal}.
    
    Gracias por reservar con nosotros.
    
    Atentamente,
    El equipo de RentACar.
    `;

    // console.log(mensajeCorreoConTotal);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "maxsilmaxsil73@gmail.com",
        pass: "bkib xteg ngri nnxk",
      },
    });

    const mailOptions = {
      from: "maxsilmaxsil73@gmail.com",
      to: emaill,
      subject: "Confirmación de reserva",
      text: mensajeCorreoConTotal,
      //  text: `Detalles de la reserva:\n${JSON.stringify(arrayOrder, null, 2)}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error enviando el email:", error);
      } else {
        console.log("Email enviado:", info.response);
      }
    });

    res.json({ message: "Correo procesado (Enviado)" });
  } catch (error) {
    console.error("Error enviando el correo:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = email;
