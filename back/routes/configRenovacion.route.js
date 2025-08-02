const {Router} = require("express")

const router = Router();

const {
    create,
    getAll,
} = require("../controllers/configRenovacion.controller")

router.post("/configRenovacion", create)
// router.get("/configPuntos", getAll)

module.exports = router;