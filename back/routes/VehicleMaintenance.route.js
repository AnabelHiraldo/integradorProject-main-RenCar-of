const { Router } = require("express");
const {
  create,
  getAll,
  getVehicleByPlaca, 
} = require("../controllers/VehicleMaintenance.controller");

const router = Router();

// Rutas
router.get("/VehicleMaintenance/vehicle/:placa", getVehicleByPlaca);
router.post("/VehicleMaintenance", create); 
router.get("/VehicleMaintenance", getAll); 


module.exports = router;
