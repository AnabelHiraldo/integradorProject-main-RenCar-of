const {Router} = require ("express")

const router = Router();


const {
    create,
  } = require("../controllers/typeSale.controller");
  
  router.post("/typeSale", create);
  
//   router.put("/typeSale/:id", update);
  
//   router.get("/typeSale", getAll);
  
//   router.get("/typeSale/:id", getOne);
  
//   router.delete("/typeSale/:id", deleteOne);
  
  module.exports = router;