const { Router } = require("express");

const router = Router();

const { getAll } = require("../controllers/razonesCancelacionReserva.controller");

router.get("/razonesCancelacionReserva", getAll);

module.exports = router;
