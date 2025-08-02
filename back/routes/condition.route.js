const { Router } = require("express");
const router = Router();

const {
  create,
  getAll
} = require("../controllers/condition.controller");

router.post("/condition", create);
router.get("/condition", getAll); 

module.exports = router;
