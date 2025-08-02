const { Router } = require("express");

const router = Router();

const {
  create,
  getAllmaintenanceService, // Asegúrate de importar la función para obtener los servicios
} = require("../controllers/maintenanceService.controller");

// Define las rutas
router.post("/maintenanceService", create);
router.get("/maintenanceService", getAllmaintenanceService); // Agrega la ruta GET para obtener todos los servicios

module.exports = router;
