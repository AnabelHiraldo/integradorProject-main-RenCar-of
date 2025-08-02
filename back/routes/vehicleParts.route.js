const {Router} = require("express")

const router = Router();

const{
    getAll,
} = require("../controllers/vehicleParts.controller")

router.get("/vehicleParts", getAll);

module.exports = router