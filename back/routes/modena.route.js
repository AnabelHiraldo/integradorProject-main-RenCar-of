const {Router} = require ("express")

const router = Router();


const {
    get,
  } = require("../controllers/modena.controller");
  
  router.get("/tipoMoneda", get);
  
//   router.put("/paymentMethod/:id", update);
  
//   router.get("/paymentMethod", getAll);
  
//   router.get("/paymentMethod/:id", getOne);
  
//   router.delete("/paymentMethod/:id", deleteOne);
  
  module.exports = router;