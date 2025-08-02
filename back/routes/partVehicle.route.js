const { Router } = require("express");

const router = Router();

const { get, create } = require("../controllers/partVehicle.controller");


router.get("/partVehicle", get);

router.post("/partVehicle", create);

module.exports = router;
