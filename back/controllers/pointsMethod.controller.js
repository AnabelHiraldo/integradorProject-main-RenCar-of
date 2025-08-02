const { sql } = require("../dbConnection");

const metodoPuntos = {};

metodoPuntos.getCustomAll = async (req, res) => {
  try {
    const response = await sql.query(`
    SELECT 
    cp.id_cliente,
    cp.id_renta,
	e.nombre as cliente,
    cp.puntosCanjeados,
    cp.fecha AS fecha_canjeo,
    cfg.id_configuracion_puntos,
    cfg.id_estado_a_i
FROM 
    canjeoPuntos cp
LEFT JOIN 
    configPuntos cfg ON cp.id_configuracion_puntos = cfg.id_configuracion_puntos
	inner join cliente c on cp.id_cliente = c.id_cliente
    inner join entidad e on c.id_cliente = e.id_entidad
WHERE 
    cp.id_estado_a_i = 1;
    `);

    res.json(response.recordset);
  } catch (error) {
    console.error("Error al obtener los métodos de puntos:", error);
    res.status(500).send("Error al obtener los métodos de puntos");
  }
};

metodoPuntos.create = async (req, res) => {
  try {
    const { nombre, descripcion, fecha, id_estado_a_i } = req.body;

    const query = `
      INSERT INTO metodo_de_punto 
      (nombre, descripcion, fecha, id_estado_a_i)
      VALUES 
      (@nombre, @descripcion, @fecha, @id_estado_a_i)
    `;

    const pool = await sql.connect();

    await pool
      .request()
      .input("nombre", sql.VarChar(50), nombre)
      .input("descripcion", sql.VarChar(100), descripcion)
      .input("fecha", sql.DateTime, fecha)
      .input("id_estado_a_i", sql.Int, id_estado_a_i)
      .query(query);

    res.json({ message: "Método de puntos creado exitosamente" });
  } catch (error) {
    console.error("Error al insertar el método de puntos:", error);
    res.status(500).send("Error al insertar el método de puntos");
  }
};

metodoPuntos.getAll = async (req, res) => {
  try {
    const query = `
        SELECT 
          id_metodo_punto, 
          nombre, 
          descripcion, 
          fecha, 
          id_estado_a_i 
        FROM metodo_de_punto
      `;

    const pool = await sql.connect();
    const result = await pool.request().query(query);

    res.json(result.recordset); 
  } catch (error) {
    console.error("Error al obtener los métodos de puntos:", error);
    res.status(500).send("Error al obtener los métodos de puntos");
  }
};

module.exports = metodoPuntos;
