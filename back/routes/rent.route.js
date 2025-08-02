const {Router} = require("express")

const router = Router();

const {
    create,
    getVehicleDispo,
    getAll,
    getRentByClient,
    GetVerifyCLient,
    renovarRenta,
    getCustomAll,
    getRentaWaitingReception,
    cancelarRenta
} = require("../controllers/rent.controller")

router.post("/rent", create)
router.get("/rent", getVehicleDispo)
router.get("/rent/getAll", getAll)
router.get("/rent/:id", getRentByClient)
router.get("/rent/getDispByClient/estees", GetVerifyCLient)
router.put("/rent", renovarRenta)
router.get("/rent/rents/getCustomAll", getCustomAll)
router.get("/rent/rents/getWaiting/reception", getRentaWaitingReception)
router.put("/rent/cancel/rent", cancelarRenta)







module.exports = router
