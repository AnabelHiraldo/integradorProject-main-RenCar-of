const { sql } = require("../dbConnection");

const politicasCancelacion = {};

politicasCancelacion.get = async (req, res) => {
  try {
    const query = await sql.query(`SELECT * FROM politicas_cancelacion`);
    res.json(query.recordset);
  } catch (error) {
    console.log("Error al obtener los datos", error);
    res.status(500).send("Error al obtener los datos");
  }
};


politicasCancelacion.create = async (req, res) => {
  const { descripcion, dias_antes, penalidad_porcentaje, id_estado_a_i } = req.body;

  try {
    const query = await sql.query(`
      INSERT INTO politicas_cancelacion (descripcion, dias_antes, penalidad_porcentaje, id_estado_a_i)
      VALUES ('${descripcion}', ${dias_antes}, ${penalidad_porcentaje}, ${id_estado_a_i});
    `);

    res.status(201).send("Política de cancelación registrada exitosamente");
  } catch (error) {
    console.log("Error al insertar los datos", error);
    res.status(500).send("Error al insertar los datos");
  }
};

module.exports = politicasCancelacion;
