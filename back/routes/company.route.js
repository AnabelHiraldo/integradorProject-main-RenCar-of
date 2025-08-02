const { Router } = require("express");

const router = Router();

const {
  create,
} = require("../controllers/company.controller");

router.post("/company", create)
 
//   router.put("/company/:id", update);
  
//   router.get("/company", getAll);
  
//   router.get("/company/:id", getOne);
  
//   router.delete("/company/:id", deleteOne);
  

module.exports = router;