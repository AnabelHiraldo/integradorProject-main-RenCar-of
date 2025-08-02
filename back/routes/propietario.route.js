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
  getPayPropietario
} = require("../controllers/propietario.controller");

router.get("/propietario/all", getCustomAll);
router.post("/propietario", create);
router.put("/propietario/:id", update);
router.get("/propietario", getAll);
router.get("/propietario/exist", veirificarExist);
router.get("/propietario/:email", getOne);
router.delete("/propietario/:id", deleteOne);
router.get("/propietario/get/getPayPropietario", getPayPropietario);


module.exports = router;