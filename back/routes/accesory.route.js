const {Router}= require ("express");

const router = Router();
const {
    create,
    update,
    // getOne,
    getAll,
    byVehicle,
  } = require("../controllers/accesory.controller");
  
  router.post("/accesory", create);

  router.put("/accesory/:id", update);
  
  // router.get("/accesory/:id", getOne);

  router.get("/accesory/:id", byVehicle);

  router.get("/accesory", getAll);

  
//   router.put("/accesory/:id", update);
  
//   router.get("/accesory", getAll);
  
//   router.get("/accesory/:id", getOne);
  
//   router.delete("/accesory/:id", deleteOne);
  
  module.exports = router;