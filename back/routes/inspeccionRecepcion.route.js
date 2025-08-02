const multer = require("multer");
const path = require("path");
const {Router} = require ("express")

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./imageDañosVehicle");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
  }).fields([
    { name: "images" },
  ]);
const {
    create,
    getAllColumn,
    getEntregaDireccion,
    getEntregaByRent
  } = require("../controllers/inspeccionRecepcion.controller");
  
  router.post("/inspeccionRecepcion", upload, create);


   router.post("/inspeccionRecepcion", create);
   router.get("/inspeccionRecepcion", getAllColumn);
   router.get("/inspeccionRecepcion/direcction", getEntregaDireccion);
   router.get("/inspeccionRecepcion/get/getEntregaByRent", getEntregaByRent);

   module.exports = router;