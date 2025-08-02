const {Router}= require ("express");

const router = Router();
const {
    create,
    getAll,
    getBrandAll,
  } = require("../controllers/brand.controller");
  
  router.post("/brand", create);
  
//   router.put("/brand/:id", update);
  
    router.get("/brand", getAll);
    router.get("/brand/getBrandAll", getBrandAll);
  
//   router.get("/brand/:id", getOne);
  
//   router.delete("/brand/:id", deleteOne);
  
  module.exports = router;