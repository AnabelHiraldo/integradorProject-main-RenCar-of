const {Router} = require ("express")

const router = Router();


const {
    create,
    getOne,
  } = require("../controllers/ciudad.controller");
  
  router.post("/ciudad", create);
  
//   router.put("/city/:id", update);
    //  router.get("/")
  
  
   router.get("/ciudad/:id", getOne);
  
//   router.delete("/city/:id", deleteOne);
  
  module.exports = router;