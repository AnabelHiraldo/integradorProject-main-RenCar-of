const { Router } = require("express");
const {
  getVehicleByPlaca,
  createAccident,
  getAllAccident,
} = require("../controllers/Accident.controller");

const router = Router();

// Ruta para obtener un vehículo por placa
router.get("/api/vehicle/:placa", getVehicleByPlaca);

// Ruta para registrar un accidente
router.post("/api/Accident", createAccident);

// Ruta para obtener todos los accidentes
router.get("/api/Accident", getAllAccident);

module.exports = router;
