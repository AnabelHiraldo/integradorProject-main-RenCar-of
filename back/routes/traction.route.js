const {Router} = require ("express")

const router = Router();


const {
    create,
    update,
    getOne,
    getAll
  } = require("../controllers/traction.controller");
  
  router.post("/traction", create);
  
   router.put("/traction/:id", update);
  
   router.get("/traction", getAll);
  
   router.get("/traction/:id", getOne);
  
//   router.delete("/traction/:id", deleteOne);
  
  module.exports = router;