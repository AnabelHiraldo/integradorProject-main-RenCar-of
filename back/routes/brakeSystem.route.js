const {Router} = require ("express")

const router = Router();


const {
    create,
    getOne,
    update,
    getAll,
  } = require("../controllers/brakeSystem.controller");
  
  router.post("/brakeSystem", create);
  
  router.put("/brakeSystem/:id", update);
  
  router.get("/brakeSystem", getAll);
  
  router.get("/brakeSystem/:id", getOne);
  
//   router.delete("/brakeSystem/:id", deleteOne);
  
  module.exports = router;