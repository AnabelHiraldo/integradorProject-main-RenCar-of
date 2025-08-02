
const {Router} = require("express")

const router = Router();

const{
    getDashboardData,
    getReservaRecientes,
    getIngresoMensual,
} = require("../controllers/dashboard.controller")

router.get("/dashboard", getDashboardData)
router.get("/dashboard/reservasRecientes", getReservaRecientes)
router.get("/dashboard/get/ingresosMensual", getIngresoMensual)



module.exports = router