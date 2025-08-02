const {Router} = require ("express")

const router = Router();

const multer = require("multer");
const path = require("path");

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
    filter
  } = require("../controllers/filtrarVehiculo.controller");
  
   router.post("/filterVehicle", upload.single("imagen"), create);

   router.get("/filterVehicle", filter);
    
  module.exports = router;