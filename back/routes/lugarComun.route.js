const {Router} = require("express")

const router = Router();

const {
    getAll,
  } = require("../controllers/lugarComun.controller");
  
  router.get("/lugarComun", getAll);
  
//   router.put("/fuel/:id", update);
  
//   router.get("/fuel", getAll);
  
//   router.get("/fuel/:id", getOne);
  
//   router.delete("/fuel/:id", deleteOne);
  
  module.exports = router;