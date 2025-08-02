const { sql } = require("../dbConnection");

const razonCancelacion = {};

razonCancelacion.get = async (req, res) => {
  try {
    const query = await sql.query("SELECT * FROM razones_cancelacion");
    res.json(query.recordset);  
  } catch (error) {
    console.error("Error al obtener los datos", error);
    res.status(500).send("Error al obtener los datos");
  }
};

razonCancelacion.create = async (req, res) => {
  const { descripcion, id_estado_a_i } = req.body;

  try {
    const query = await sql.query(`
      INSERT INTO razones_cancelacion (descripcion, id_estado_a_i) 
      VALUES ('${descripcion}', ${id_estado_a_i});
    `);
    res.status(201).send("Razón de cancelación registrada exitosamente");
  } catch (error) {
    console.error("Error al insertar los datos", error);
    res.status(500).send("Error al insertar los datos");
  }
};

module.exports = razonCancelacion;
