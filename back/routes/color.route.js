const { Router } = require("express");

const router = Router();

const { create, getOne, update, getAll } = require("../controllers/color.controller");

router.post("/colors", create);

router.get("/colors/:id", getOne);

router.get("/colors", getAll);

router.put("/colors/:id", update);


module.exports = router;