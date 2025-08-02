const {Router} = require("express")

const router = Router();

const {
    create,
    update,
    getOne,
    getAll,
} = require("../controllers/propulsionSystem.controller")

router.post("/propulsion",create)
router.put("/propulsion/:id",update)
router.get("/propulsion",getAll)
router.get("/propulsion/:id",getOne)

module.exports = router;