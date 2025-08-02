const {Router} = require ("express")

const router = Router();


const {
    create,
  } = require("../controllers/permission.controller");
  
  router.post("/permission", create);
  
//   router.put("/permission/:id", update);
  
//   router.get("/permission", getAll);
  
//   router.get("/permission/:id", getOne);
  
//   router.delete("/permission/:id", deleteOne);
  
  module.exports = router;