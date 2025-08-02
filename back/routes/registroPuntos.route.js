const { Router } = require("express");

const router = Router();

const { getAll } = require("../controllers/registroPuntos.controller");

router.get("/registroPuntos/all", getAll);

module.exports = router;
