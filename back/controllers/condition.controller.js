const { sql }= require("../dbConnection");

const condition = {};

condition.create = async (req, res) => {
  try {
    const { nombre, descripcion, fecha, id_estado_a_i } = req.body;

    if (!nombre || !descripcion || !fecha || !id_estado_a_i) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const query = await sql.query(`
      INSERT INTO condicion (nombre, descripcion, fecha, id_estado_a_i)
      OUTPUT INSERTED.id_condicion AS lastId
      VALUES (@nombre, @descripcion, @fecha, @id_estado_a_i)
    `);

    await sql.request()
      .input("id_condicion", sql.Int, lastICondicion)
      .input("nombre", sql.VarChar, nombre)
      .input("descripcion", sql.VarChar, descripcion)
      .input("fecha", sql.DateTime, fecha)
      .input("id_estado_a_i", sql.Int, id_estado_a_i);

    res.json({ message: "Condición registrada con éxito" });
    
  } catch (error) {
    console.error("Error al insertar datos:", error.message);
    res.status(500).send("Error al insertar datos");
  }
};





condition.getAll = async (req, res) => {
  try {
    const query = `
      SELECT * 
      FROM condicion
    `;
    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las condiciones:", error.message);
    res.status(500).json({ message: "Error al obtener las condiciones", error: error.message });
  }
};

module.exports = condition;




