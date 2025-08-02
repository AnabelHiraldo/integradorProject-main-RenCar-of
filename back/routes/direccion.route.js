const {Router} = require("express")

const router = Router();

const{
    create,
    getOne,
} = require("../controllers/direccion.controller")

router.post("/direccion", create);
router.get("/direccion/:id", getOne)

module.exports = router