const { Router } = require("express");

const router = Router();

const {
  create,
  getAll,
} = require("../controllers/typeDocument.controller");

router.get("/typeDocument", getAll)
module.exports = router;