const { Router } = require("express");

const router = Router();
const { create, getAll } = require("../controllers/anularPuntos.controller");

router.post("/anularPuntos", create);
router.get("/anularPuntos", getAll);

module.exports = router;
