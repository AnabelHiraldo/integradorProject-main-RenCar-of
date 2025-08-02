const {Router} = require("express")

const router = Router()

const{
    create,
    getAll,
} = require("../controllers/politicaPagoReserva.controller")

router.post("/politicPayReserva", create)
router.get("/politicPayReserva", getAll)


module.exports = router

