const { sql } = require("../dbConnection");
const registroPuntos = {};

registroPuntos.getAll = async (req, res) => {
  try {
    const queryResult = await sql.query(`
        SELECT 
    rp.id_cliente,
	e.nombre as cliente,
    rp.id_renta,
    rp.puntosObtenidos,
    rp.fecha AS fecha_registro,
    cp.id_configuracion_puntos,
    cp.id_estado_a_i
FROM 
    registroPuntos rp
LEFT JOIN 
    configPuntos cp ON rp.id_configuracion_puntos = cp.id_configuracion_puntos
inner join cliente c on rp.id_cliente = c.id_cliente
inner join entidad e on c.id_cliente = e.id_entidad
WHERE 
    rp.id_estado_a_i = 1;
        
        `);
    res.json(queryResult.recordset);
  } catch (error) {
    console.log("Error inserting data", error);
  }
};

module.exports = registroPuntos;
