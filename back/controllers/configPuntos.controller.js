const { sql } = require("../dbConnection");

const configPuntos = {};

configPuntos.create = async (req, res) => {
  try {
    const {
      cantRentMinima,
      id_metodo_punto,
      cantidad_punto,
      consumo_requerido,
      limiteCanjeXAlquiler,
      minimoPuntoCanjear,
      maximoPuntoCanjear,
      fecha_vencimiento_punto,
      fecha_inicio,
      fecha_fin,
      id_estado_a_i,
    } = req.body;

    const limiteCanjeValue =
      limiteCanjeXAlquiler !== undefined && limiteCanjeXAlquiler !== null
        ? limiteCanjeXAlquiler
        : 0; 
    const fechaVencimientoValue = fecha_vencimiento_punto || null;
    const fechaInicioValue = fecha_inicio || null;
    const fechaFinValue = fecha_fin || null;
    const idEstadoAIValue = id_estado_a_i || 1;

    const query = `
      INSERT INTO configPuntos 
      (cantRentMinima, id_metodo_punto, cantidad_punto, consumo_requerido, limiteCanjeXAlquiler, 
       minimoPuntoCanjear, maximoPuntoCanjear, fecha_vencimiento_punto, fecha_inicio, fecha_fin, id_estado_a_i)
      VALUES 
      (@cantRentMinima, @id_metodo_punto, @cantidad_punto, @consumo_requerido, @limiteCanjeXAlquiler, 
       @minimoPuntoCanjear, @maximoPuntoCanjear, @fecha_vencimiento_punto, @fecha_inicio, @fecha_fin, @id_estado_a_i);
    `;

    const pool = await sql.connect();
    await pool
      .request()
      .input("cantRentMinima", sql.Int, cantRentMinima)
      .input("id_metodo_punto", sql.Int, id_metodo_punto)
      .input("cantidad_punto", sql.Int, cantidad_punto)
      .input("consumo_requerido", sql.Int, consumo_requerido)
      .input("limiteCanjeXAlquiler", sql.Decimal(10, 2), limiteCanjeValue)
      .input("minimoPuntoCanjear", sql.Int, minimoPuntoCanjear)
      .input("maximoPuntoCanjear", sql.Int, maximoPuntoCanjear)
      .input("fecha_vencimiento_punto", sql.DateTime, fechaVencimientoValue)
      .input("fecha_inicio", sql.DateTime, fechaInicioValue)
      .input("fecha_fin", sql.DateTime, fechaFinValue || null)
      .input("id_estado_a_i", sql.Int, idEstadoAIValue)
      .query(query);

    res.json({ message: "Configuración de puntos creada exitosamente" });
  } catch (error) {
    console.error("Error al insertar la configuración de puntos:", error);
    res.status(500).send("Error al insertar la configuración de puntos");
  }
};

configPuntos.getAll = async(req, res) =>{

  try {
    const query = await sql.query(
      `
      select 
      id_configuracion_puntos,
      cantRentMinima,
      cantidad_punto,
      consumo_requerido,
      limiteCanjeXAlquiler,
      minimoPuntoCanjear,
      maximoPuntoCanjear,
      id_metodo_punto
      
      from configPuntos where id_estado_a_i = 1`
    );
    res.json(query.recordset);
  } catch (error) {
    console.log("Error getting data",error)
  }
  
  
}

module.exports = configPuntos;
