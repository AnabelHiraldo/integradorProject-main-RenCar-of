const {Router} = require ("express")

const router = Router();


const {
    create,
    update,
    getOne,
    getAll
  } = require("../controllers/vehicleType.controller");
  
   router.post("/vehicleType", create);
  
   router.put("/vehicleType/:id", update);
  
   router.get("/vehicleType", getAll);
  
   router.get("/vehicleType/:id", getOne);
  
//   router.delete("/vehicleType/:id", deleteOne);
  
  module.exports = router;