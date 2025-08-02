const { Router } = require("express");

const router = Router();

const {
  create,
  getAll,
} = require("../controllers/myCompany.controller");

router.get("/myCompany",getAll)
module.exports = router;