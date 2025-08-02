const {Router} = require("express")

const router = Router();

const{
    getAll,
} = require("../controllers/tipo_daño.controller")

router.get("/tipoDamage", getAll);

module.exports = router