const { sql } = require("../dbConnection"); 


const typeMaintenance = {};



typeMaintenance.create = async (req, res) => {
  try {
    const { nombre, id_estado_a_i } = req.body;

    if (!nombre || id_estado_a_i === undefined) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const query = `
      INSERT INTO tipoMantenimiento (nombre, id_estado_a_i)
      VALUES (@nombre, @id_estado_a_i)
    `;

    await sql.query(query, { nombre, id_estado_a_i });

    res.json({ message: "Tipo de mantenimiento creado con éxito" });
  } catch (error) {
    console.error("Error al crear el tipo de mantenimiento:", error.message);
    res.status(500).json({
      message: "Error al crear el tipo de mantenimiento",
      error: error.message,
    });
  }
}

typeMaintenance.getAll = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tipoMantenimiento");
    res.json(result.recordset); 
  } catch (error) {
    console.error("Error al obtener tipos de mantenimiento:", error.message);
    res.status(500).json({
      message: "Error al obtener tipos de mantenimiento",
      error: error.message,
    });
  }
}



  

module.exports = typeMaintenance;
