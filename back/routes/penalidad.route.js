const { Router } = require("express");

const router = Router();

const {
  getAll,
} = require("../controllers/penalidad.controller");

router.get("/penalidad",getAll)
module.exports = router;