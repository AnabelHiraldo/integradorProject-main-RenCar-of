const { Router } = require("express");
const router = Router();

const { create, getAll, getOne } = require("../controllers/employee.controller");

// Rutas
router.post("/employee", create);
router.get("/employee", getAll);
router.get("/employee/:id", getOne); // Agregando el endpoint para obtener uno por ID

module.exports = router;
