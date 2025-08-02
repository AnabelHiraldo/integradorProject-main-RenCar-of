const {Router} = require ("express")

const router = Router();


const {
    create,
    getAll
  } = require("../controllers/entityType.controller");
  
  router.post("/entityType", create);
  
//   router.put("/entityType/:id", update);
  
  router.get("/entityType", getAll);
  
//   router.get("/entityType/:id", getOne);
  
//   router.delete("/entityType/:id", deleteOne);
  
  module.exports = router;