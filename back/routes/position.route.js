const { Router } = require("express");

const router = Router();

const {
  create,
} = require("../controllers/position.controller");

router.post("/position",create)
//   router.put("/position/:id", update);
  
//   router.get("/position", getAll);
  
//   router.get("/position/:id", getOne);
  
//   router.delete("/position/:id", deleteOne);
  
module.exports = router;