const {Router}= require ("express");

const router = Router();
const {
    create,
    getByPropietario
  } = require("../controllers/acuerdo.controller");
  
  router.post("/acuerdo", create);
  router.get("/acuerdo/:id_propietario", getByPropietario);



  
  module.exports = router;