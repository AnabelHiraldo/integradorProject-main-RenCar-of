const { sql } = require("../dbConnection");

const tipoDanio = {};

tipoDanio.get = async (req, res) => {
  try {
    const query = await sql.query(`SELECT * FROM tipo_daño`);
    res.json(query.recordset);
  } catch (error) {
    console.log("Error al obtener los datos", error);
    res.status(500).send("Error al obtener los datos");
  }
};

tipoDanio.create = async (req, res) => {
  const { nombre, descripcion, id_estado_a_i } = req.body;

  try {
    const query = await sql.query(`
      INSERT INTO tipo_daño (nombre, descripcion, id_estado_a_i) 
      VALUES ('${nombre}', '${descripcion}', ${id_estado_a_i});
    `);

    res.status(201).send("Tipo de daño registrado exitosamente");
  } catch (error) {
    console.log("Error al insertar los datos", error);
    res.status(500).send("Error al insertar los datos");
  }
};

module.exports = tipoDanio;
