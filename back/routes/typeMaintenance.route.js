const {Router} = require ("express")

const router = Router();


const {
    create,
    getAll,
   
  } = require("../controllers/typeMaintenance.controller");
  
  router.post("/typeMaintenance", create);
  router.get("/typeMaintenance", getAll);


  
//   router.put("/status/:id", update);
  
//   router.get("/status", getAll);
  
 
  
//   router.delete("/status/:id", deleteOne);
  
  module.exports = router;
  