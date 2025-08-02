const entityType = {};
const { sql } = require("../dbConnection");

entityType.create = async (req, res) => {
  try {
    const { nombre, fecha, id_estado_a_i } = req.body;
    const query = await sql.query(
      `INSERT INTO tipo_entidad (nombre, fecha, id_estado_a_i)
         OUTPUT INSERTED.id_tipo_entidad AS lastId
         VALUES ('${nombre}', '${fecha}', ${id_estado_a_i})`
    );

    res.json({ message: "Tipo de entidad registrado con éxito" });
  } catch (error) {
    console.log("Error inserting Data", error);
    res.status(500).send("Error Inserting Data");
  }
};

entityType.getAll = async (req, res) => {
  try {
    const query = await sql.query("SELECT * FROM tipo_entidad");
    return res.json(query.recordset);
  } catch (error) {
    console.log("Error fetching Data", error);
    res.status(500).send("Error Fetching Data");
  }
};

module.exports = entityType;
