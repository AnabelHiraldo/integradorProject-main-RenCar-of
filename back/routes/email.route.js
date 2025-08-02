const { Router } = require("express");

const router = Router();

const {
  create,
} = require("../controllers/email.controller");

router.post("/email", create);


// router.post("/email/:emaill/:text",create)
//   router.put("/employee/:id", update);
  
//   router.get("/employee", getAll);
  
//   router.get("/employee/:id", getOne);
  
//   router.delete("/employee/:id", deleteOne);
  
module.exports = router;