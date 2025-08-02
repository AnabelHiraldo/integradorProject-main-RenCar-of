const {Router}= require ("express");

const router = Router();
const {
    create,
    getOne,
    getEspecial,
  } = require("../controllers/version.controller");
  
  router.post("/version", create);
  
//   router.put("/version/:id", update);
  
//   router.get("/version", getAll);
  
   router.get("/version/:id", getOne);

  
//   router.delete("/version/:id", deleteOne);
  
  module.exports = router;