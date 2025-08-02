const {Router} = require("express")

const router = Router();

const{
    getAll,
} = require("../controllers/gravedad.controller")

router.get("/gravedad", getAll);

module.exports = router