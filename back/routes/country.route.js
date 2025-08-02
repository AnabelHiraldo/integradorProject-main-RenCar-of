const {Router} = require ("express")

const router = Router();


const {
    create,
  } = require("../controllers/country.controller");
  
  router.post("/country", create);
  
//   router.put("/country/:id", update);
  
//   router.get("/country", getAll);
  
//   router.get("/country/:id", getOne);
  
//   router.delete("/country/:id", deleteOne);
  
  module.exports = router;