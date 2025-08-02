const { Router } = require("express");

const router = Router();

const {
  create,
  update,
  getAll,
  getOne,
  deleteOne,
  veirificarExist,
  getCustomAll,
  getByIDForContrato
} = require("../controllers/client.controller");

router.get("/clients/all", getCustomAll);
router.post("/clients", create);
router.put("/clients/:id", update);
router.get("/clients", getAll);
router.get("/clients/exist", veirificarExist);
router.get("/clients/:email", getOne);
router.delete("/clients/:id", deleteOne);
router.get("/clients/contrato/:id_cliente",getByIDForContrato);


module.exports = router;