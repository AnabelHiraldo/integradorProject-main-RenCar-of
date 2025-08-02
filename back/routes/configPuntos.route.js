const {Router} = require("express")

const router = Router();

const {
    create,
    getAll,
} = require("../controllers/configPuntos.controller")

router.post("/configPuntos", create)
router.get("/configPuntos", getAll)

module.exports = router;