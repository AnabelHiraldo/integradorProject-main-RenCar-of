const { sql } = require("../dbConnection");

const telephoneType = {};

telephoneType.create = async (req, res) => {
  try {
    const { tipo, descripcion, id_estado_a_i } = req.body;

    const query = await sql.query(
      `INSERT INTO tipo_telefono (tipo, descripcion, id_estado_a_i)
         OUTPUT INSERTED.id_tipo_telefono AS lastId
         VALUES ('${tipo}', '${descripcion}', ${id_estado_a_i})`
    );

    res.json({ message: "Tipo de telefono registrado con éxito" });
  } catch (error) {
    console.log("Error inserting Data", error);
    res.status(500).send("Error Inserting Data");
  }
};

telephoneType.getAll = async (req, res) => {
  try {
    const query = await sql.query("SELECT * FROM tipo_telefono");

    if (query.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros" });
    }

    res.json(query.recordset);
  } catch (error) {
    console.log("Error getting data", error);
  }
};

module.exports = telephoneType;
