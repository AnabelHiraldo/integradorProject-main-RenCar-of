const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const PORT = 3000;

app.set("port", process.env.PORT || PORT);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API de clientes funcionando correctamente",
  });
});

app.use("/api", require("./routes/client.route"));
app.use("/api", require("./routes/employee.route"));
app.use("/api", require("./routes/company.route"));
app.use("/api", require("./routes/position.route"));
app.use("/api", require("./routes/typeDocument.route"));
app.use("/api", require("./routes/sexo.route"));
app.use("/api", require("./routes/entityType.route"));
app.use("/api", require("./routes/brand.route"));
app.use("/api", require("./routes/model.route"));
app.use("/api", require("./routes/accesory.route"));
app.use("/api", require("./routes/status.route"));
app.use("/api", require("./routes/vehicle.route"));
app.use("/api", require("./routes/color.route"));
app.use("/api", require("./routes/brakeSystem.route"));
app.use("/api", require("./routes/traction.route"));
app.use("/api", require("./routes/vehicleType.route"));
app.use("/api", require("./routes/transmition.route"));
app.use("/api", require("./routes/propulsionSystem.route"));
app.use("/api", require("./routes/category.route"));
app.use("/api", require("./routes/version.route"));
app.use("/api", require("./routes/email.route"));
app.use("/api", require("./routes/reserva.route"));
app.use("/api", require("./routes/rent.route"));
app.use("/api", require("./routes/configPuntos.route"));
app.use("/api", require("./routes/pointsMethod.route"));
app.use("/api", require("./routes/province.route"));
app.use("/api", require("./routes//ciudad.route"));
app.use("/api", require("./routes/telephoneType.route"));
app.use("/api", require("./routes/direccion.route"));
app.use("/api", require("./routes/myCompany.route"));
app.use("/api", require("./routes/politicaPagoReserva.route"));
app.use("/api", require("./routes/VehicleMaintenance.route"));
app.use("/api", require("./routes/accident.route"));
app.use("/api", require("./routes/typeMaintenance.route"));
app.use("/api", require("./routes/condition.route"));
app.use("/api", require("./routes/maintenanceService.route"));
app.use("/api", require("./routes/filtrarVehiculo.route"));
app.use("/api", require("./routes/login.route"));
app.use("/api", require("./routes/user.route"));
app.use("/api", require("./routes/penalidad.route"));
app.use("/api", require("./routes/anularPuntos.route"));
app.use("/api", require("./routes/lugarComun.route"));
app.use("/api", require("./routes/inspeccionEntrega.route"));
app.use("/api", require("./routes/createFastClient.route"));
app.use("/api", require("./routes/modena.route"));
app.use("/api", require("./routes/paymentMethod.route"));
app.use("/api", require("./routes/configRenovacion.route"));
app.use("/api", require("./routes/registroPuntos.route"));
app.use("/api", require("./routes/vehicleParts.route"));
app.use("/api", require("./routes/tipoDaño.route"));
app.use("/api", require("./routes/gravedad.route"));
app.use("/api", require("./routes/inspeccionRecepcion.route"));
app.use("/api", require("./routes/razonesCancelacionReserva.route"));
app.use("/api", require("./routes/politicaCacelacion.route"));
app.use("/api", require("./routes/propietario.route"));
app.use("/api", require("./routes/tipoAcuerdo.route"));
app.use("/api", require("./routes/acuerdo.route"));
app.use("/api", require("./routes/tipoArchivo.route"));
app.use("/api", require("./routes/damage.route"));
app.use("/api", require("./routes/PoliticaCancel.route"));
app.use("/api", require("./routes/partVehicle.route"));
app.use("/api", require("./routes/CancelReason.route"));
app.use("/api", require("./routes/dashboard.route"));





app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/imageDañosVehicle",
  express.static(path.join(__dirname, "imageDañosVehicle"))
);
app.use(
  "/archivos_vehiculos",
  express.static(path.join(__dirname, "archivos_vehiculos"))
);

module.exports = app;
