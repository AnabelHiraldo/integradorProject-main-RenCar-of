const { sql } = require("../dbConnection");

const confRenovacion = {};

confRenovacion.create = async (req, res) => {
  try {
    console.log("req.body create", req.body);

    const { tiempoMaximoExtension, tiempoMinimoExtension, cantidadXRenta, id_estado_a_i } = req.body;

    const pool = await sql.connect();

    const deactivateQuery = `
      UPDATE confRenovacion
      SET id_estado_a_i = 2
      WHERE id_conf_renovacion = (
        SELECT TOP 1 id_conf_renovacion 
        FROM confRenovacion
        WHERE id_estado_a_i = 1
        ORDER BY id_conf_renovacion DESC
      )
    `;
    await pool.request().query(deactivateQuery);

    const insertQuery = `
      INSERT INTO confRenovacion (tiempoMaximoExtension, tiempoMinimoExtension, cantidadXRenta, id_estado_a_i)
      OUTPUT INSERTED.id_conf_renovacion AS lastId
      VALUES (@tiempoMaximoExtension, @tiempoMinimoExtension, @cantidadXRenta, @id_estado_a_i)
    `;

    const result = await pool.request()
      .input("tiempoMaximoExtension", sql.Int, tiempoMaximoExtension)
      .input("tiempoMinimoExtension", sql.Int, tiempoMinimoExtension)
      .input("cantidadXRenta", sql.Int, cantidadXRenta)
      .input("id_estado_a_i", sql.Int, id_estado_a_i)
      .query(insertQuery);

    const lastId = result.recordset[0].lastId;

    res.json({ message: "Configuración de renovación registrada con éxito", lastId });
  } catch (error) {
    console.log("Error inserting Data", error);
    res.status(500).send("Error Inserting Data");
  }
};

module.exports = confRenovacion