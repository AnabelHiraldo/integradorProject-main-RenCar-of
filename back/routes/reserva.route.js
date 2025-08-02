const multer = require("multer");
const path = require("path");
const { Router } = require("express");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const {
  create,
  update,
  getReservaDispo,
  getByCliente,
  getAll,
  cancelarReserva,
} = require("../controllers/reserva.controller");

router.post("/reserva", upload.single("imagen"), create);
router.post("/reserva", create);
router.put("/reserva", update);
router.get("/reserva", getReservaDispo);
router.get("/reserva/getByClient", getByCliente);
router.get("/reserva/all", getAll);
router.put("/reserva/cancel/reserva", cancelarReserva)




module.exports = router;
