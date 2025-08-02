const {Router} = require ("express")

const router = Router();

const {
    create,
    getAllColumn,
    getEntregaDireccion,
  } = require("../controllers/inspeccionEntrega.controller");
  
   router.post("/InspeccionEntrega", create);
   router.get("/InspeccionEntrega", getAllColumn);
   router.get("/InspeccionEntrega/direcction", getEntregaDireccion);


   module.exports = router;