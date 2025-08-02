const { sql, connectToDatabase } = require("./dbConnection");

const app = require("./app");


const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


const imageDañosVehicle = path.join(__dirname, "imageDañosVehicle");
if (!fs.existsSync(imageDañosVehicle)) {
    fs.mkdirSync(imageDañosVehicle);
}

const archivosVehiculoDir = path.join(__dirname, "archivos_vehiculos");
if (!fs.existsSync(archivosVehiculoDir)) {
    fs.mkdirSync(archivosVehiculoDir);
    console.log("Carpeta 'archivos_vehiculos' creada exitosamente.");
}

async function main() {
  await connectToDatabase();
  
  await app.listen(app.get("port"));

  console.log(`Server on port ${app.get("port")}`);
}

main();
