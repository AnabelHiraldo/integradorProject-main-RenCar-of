const {Router} = require ("express")

const router = Router();


const {
    create,
  } = require("../controllers/vehiclePolicy.controller");
  
  router.post("/vehiclePolicy", create);
  
//   router.put("/vehiclePolicy/:id", update);
  
//   router.get("/vehiclePolicy", getAll);
  
//   router.get("/vehiclePolicy/:id", getOne);
  
//   router.delete("/vehiclePolicy/:id", deleteOne);
  
  module.exports = router;