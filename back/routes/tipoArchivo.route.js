const {Router} = require("express")

const router = Router();

const{
    getAll,
} = require("../controllers/tipoArchivo.controller")

router.get("/tipoArchivo", getAll);

module.exports = router
