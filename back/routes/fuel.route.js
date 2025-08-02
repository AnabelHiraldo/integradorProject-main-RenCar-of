const {Router} = require ("express")

const router = Router();


const {
    create,
  } = require("../controllers/fuel.controller");
  
  router.post("/fuel", create);
  
//   router.put("/fuel/:id", update);
  
//   router.get("/fuel", getAll);
  
//   router.get("/fuel/:id", getOne);
  
//   router.delete("/fuel/:id", deleteOne);
  
  module.exports = router;