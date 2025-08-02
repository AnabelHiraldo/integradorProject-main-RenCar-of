const {Router} = require ("express")

const router = Router();


const {
    create,
    getAll,
  } = require("../controllers/telephoneType.controller");
  
  router.post("/telephoneType", create);
  
//   router.put("/telephoneType/:id", update);
  
    router.get("/telephoneType", getAll);
  
//   router.get("/telephoneType/:id", getOne);
  
//   router.delete("/telephoneType/:id", deleteOne);
  
  module.exports = router;