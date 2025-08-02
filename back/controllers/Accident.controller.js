const { sql } = require("../dbConnection");

const Accident = {};

Accident.getVehicleByPlaca = async (req, res) => {
  try {
    const { placa } = req.params;

    if (!placa) {
      return res.status(400).json({ message: "La placa es obligatoria" });
    }

    const result = await sql.query(`
      SELECT 
        v.id_vehiculo,
        v.placa,
        m.marca,
        md.modelo,
        v.veersion AS version,
        v.año
      FROM vehiculo v
      LEFT JOIN marca m ON v.id_marca = m.id_marca
      LEFT JOIN modelo md ON v.id_modelo = md.id_modelo
      WHERE v.placa = @placa
    `, new sql.Request().input('placa', sql.VarChar, placa)); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error al buscar el vehículo:", error.message);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};


Accident.createAccident = async (req, res) => {
  try {
    const { placa, id_empleado, fecha_accidente, descripcion } = req.body;

  
    if (!placa || !id_empleado || !fecha_accidente || !descripcion) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

   
    const vehicleResult = await sql.query(`
      SELECT id_vehiculo FROM vehiculo WHERE placa = @placa
    `, new sql.Request().input('placa', sql.VarChar, placa)); 

    if (vehicleResult.recordset.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    const id_vehiculo = vehicleResult.recordset[0].id_vehiculo;

   
    await sql.query(`
      INSERT INTO accidenteVehiculo (id_vehiculo, id_empleado, fecha_accidente, descripcion)
      VALUES (@id_vehiculo, @id_empleado, @fecha_accidente, @descripcion)
    `, new sql.Request()
      .input('id_vehiculo', sql.Int, id_vehiculo)
      .input('id_empleado', sql.Int, id_empleado)
      .input('fecha_accidente', sql.DateTime, fecha_accidente)
      .input('descripcion', sql.VarChar, descripcion)); 

    res.json({ message: "Accidente registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar el accidente:", error.message);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

Accident.getAllAccident = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
        v.placa,
        m.marca,
        md.modelo,
        v.veersion AS version,
        c.color,
        v.año,
        a.fecha_accidente,
        a.descripcion
      FROM accidenteVehiculo a
      JOIN vehiculo v ON a.id_vehiculo = v.id_vehiculo
      LEFT JOIN marca m ON v.id_marca = m.id_marca
      LEFT JOIN modelo md ON v.id_modelo = md.id_modelo
      LEFT JOIN color c ON v.id_color = c.id_color
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los accidentes:", error.message);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = Accident;
