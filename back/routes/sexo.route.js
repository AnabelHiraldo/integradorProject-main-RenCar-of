const { Router } = require("express");

const router = Router();

const {
  getAll
} = require("../controllers/sexo.controller");

router.get("/sexo", getAll)

module.exports = router;