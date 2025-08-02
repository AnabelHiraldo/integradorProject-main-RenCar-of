const {Router} = require ("express")

const router = Router();

const {
    create,
    getAll,
  } = require("../controllers/category.controller");
  
  router.post("/category", create);
  
//   router.put("/category/:id", update);
  router.get("/category", getAll);
  
//   router.get("/category/:id", getOne);
  
//   router.delete("/category/:id", deleteOne);
  
  module.exports = router;