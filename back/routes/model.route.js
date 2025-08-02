const {Router} = require ("express")

const router = Router();


const {
    create,
    getOne
  } = require("../controllers/model.controller");
  
  router.post("/model", create);
  
//   router.put("/model/:id", update);
  
//   router.get("/model", getAll);
  
   router.get("/model/:id", getOne);
  
//   router.delete("/model/:id", deleteOne);
  
  module.exports = router;