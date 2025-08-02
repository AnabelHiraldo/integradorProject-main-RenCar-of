const {Router} = require ("express")

const router = Router();


const {
    create,
  } = require("../controllers/telephone.controller");
  
  router.post("/telephone", create);
  
//   router.put("/telephone/:id", update);
  
//   router.get("/telephone", getAll);
  
//   router.get("/telephone/:id", getOne);
  
//   router.delete("/telephone/:id", deleteOne);
  
  module.exports = router;