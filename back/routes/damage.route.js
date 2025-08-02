const { Router } = require("express");

const router = Router();


const { get, create } = require("../controllers/damage.controller");

router.get("/damage", get);

router.post("/damage", create);

module.exports = router;
