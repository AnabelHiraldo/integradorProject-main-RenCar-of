const {Router} = require ("express")

const router = Router();


const {
    create,
    get,
  } = require("../controllers/paymentMethod.controller");
  
  router.post("/paymentMethod", create);
  router.get("/paymentMethod", get);

  
//   router.put("/paymentMethod/:id", update);
  
//   router.get("/paymentMethod", getAll);
  
//   router.get("/paymentMethod/:id", getOne);
  
//   router.delete("/paymentMethod/:id", deleteOne);
  
  module.exports = router;