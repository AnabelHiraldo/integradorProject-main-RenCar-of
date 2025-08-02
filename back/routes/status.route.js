const {Router} = require ("express")

const router = Router();


const {
    create,
    getAll,
  } = require("../controllers/status.controller");
  
  router.post("/status", create);
  router.get("/status", getAll);

  
//   router.put("/status/:id", update);
  
//   router.get("/status", getAll);
  
//   router.get("/status/:id", getOne);
  
//   router.delete("/status/:id", deleteOne);
  
  module.exports = router;