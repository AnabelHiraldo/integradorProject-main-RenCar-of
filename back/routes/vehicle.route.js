const multer = require("multer");
const path = require("path");
const { Router } = require("express");

const router = Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads"); 
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`); 
//   },
// });

// // Configuración para subir archivos relacionados con vehículos
// const storageArchivosVehiculo = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./archivos_vehiculos");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });


// const upload = multer({ storage });
// const archivos_vehiculos = multer({
//   storageArchivosVehiculo,
// }).fields([
//   { name: "ruta_archivo" },
// ]);

// Configuración para subir imágenes
const storageImagenes = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Carpeta para imágenes principales
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configuración para subir archivos adicionales
const storageArchivosVehiculo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./archivos_vehiculos"); // Carpeta específica para archivos adicionales
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "imagen") {
        cb(null, "./uploads"); // Imagen principal
      } else if (file.fieldname === "ruta_archivo") {
        cb(null, "./archivos_vehiculos"); // Archivos adicionales
      } else {
        cb(new Error("Campo de archivo inesperado"));
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
}).fields([
  { name: "imagen", maxCount: 1 }, // Imagen principal
  { name: "ruta_archivo", maxCount: 10 }, // Archivos adicionales
]);

// const upload = multer({
//   storage: storageImagenes, storage: storageArchivosVehiculo
// }).fields([
//   { name: "imagen", maxCount: 1 }, // Campo para la imagen principal
//   { name: "ruta_archivo", maxCount: 10 }, 
// ]);


const {
  create,
  update,
  getOne,
  getAll,
  getEspecial,
  getDisponibilidad,
  getPlotica,
  getVehicleWithFiles,
} = require("../controllers/vehicle.controller");

// Rutas
router.post("/vehicle", upload, create);


router.put("/vehicle/:id", update);
router.get("/vehicle/:id", getOne);
router.get("/vehicle", getAll);
router.get("/vehicle/:id_marca/:id_modelo/:id_version/:fecha", getEspecial);
router.get("/vehicle/:id_vehiculo/:fechaInicio/:fechaFin", getDisponibilidad);
router.get("/vehicle/plotica/:_id", getPlotica);
router.get("/vehicle/plotica/get/vehicle/files/with", getVehicleWithFiles);


module.exports = router;
