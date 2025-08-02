const {Router} = require ("express")

const router = Router();


const {
    create,
  } = require("../controllers/role.controller");
  
  router.post("/role", create);
  
//   router.put("/role/:id", update);
  
//   router.get("/role", getAll);
  
//   router.get("/role/:id", getOne);
  
//   router.delete("/role/:id", deleteOne);
  
  module.exports = router;