const {Router} = require("express")

const router = Router()

const{
    getAll,
} = require("../controllers/politicaCancelacion.controller")

// router.post("/politicPayReserva", create)
router.get("/politicaCancelacion", getAll)


module.exports = router

