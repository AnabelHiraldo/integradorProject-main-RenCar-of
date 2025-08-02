const {Router} = require("express")

const router = Router();

const{
    getAll,
} = require("../controllers/tipoAcuerdo.controller")

router.get("/tipoAcuerdo", getAll);

module.exports = router