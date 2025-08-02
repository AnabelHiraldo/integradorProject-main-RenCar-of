const { Router } = require("express");

const router = Router();


const { get, create } = require("../controllers/PoliticaCancel.controller");


router.get("/PoliticaCancel", get);

router.post("/PoliticaCancel", create);

module.exports = router;
