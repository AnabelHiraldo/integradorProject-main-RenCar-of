const {Router} = require("express")

const router = Router();

const{
    create,
    getAll,
    getCustomAll
} = require("../controllers/pointsMethod.controller")

router.post("/pointsMethod",create)
router.get("/pointsMethod",getAll)
router.get("/pointsMethod/all", getCustomAll)


module.exports = router;