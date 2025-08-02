const {Router} = require ("express")

const router = Router();


const {
    create,
    getAll
  } = require("../controllers/province.controller");
  
  router.post("/province", create);
  
//   router.put("/province/:id", update);
  
   router.get("/province", getAll);
  
//   router.get("/province/:id", getOne);
  
//   router.delete("/province/:id", deleteOne);
  
  module.exports = router;