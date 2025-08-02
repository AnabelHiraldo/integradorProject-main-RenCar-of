const {Router} = require("express")

const router = Router();

const {
    create,
    update,
    getOne,
    getAll,
} = require("../controllers/transmition.controller")

router.post("/transmition",create)
router.put("/transmition/:id",update)
router.get("/transmition",getAll)
router.get("/transmition/:id",getOne)

module.exports = router;