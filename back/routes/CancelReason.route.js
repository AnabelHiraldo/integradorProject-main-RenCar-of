const { Router } = require("express");

const router = Router();


const { get, create } = require("../controllers/CancelReason.controller");


router.get("/CancelReason", get);

router.post("/CancelReason", create);

module.exports = router;
