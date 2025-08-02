const { sql } = require("../dbConnection");

const anulatepoints = {};

anulatepoints.getAll = async (req, res) => {
  console.log("AAA");
  
  try {
    const query = await sql.query(`
      SELECT 
    ap.id_cliente,
    ap.id_renta,
	e.nombre as cliente,
    ap.puntos_anulados,
    ap.fecha_anulacion,
	ap.id_estado_a_i
FROM 
    anulacion_punto ap
inner join cliente c on ap.id_cliente = c.id_cliente
inner join entidad e on c.id_entidad = e.id_entidad
   where ap.id_estado_a_i = 1;
      `);

    res.json(query.recordset);
  } catch (error) {
    console.log("Error getting data", error);
    res.status(500).send("Error getting data");
  }
};

anulatepoints.create = async (req, res) => {
  const fechaActual = new Date().toISOString().split("T")[0];

  try {
    console.log("req.body create", req.body);

    const {
      id_cliente,
      id_renta,
      puntos_anulados,
      motivo,
      id_penalidad,
      id_estado_a_i,
    } = req.body;

    const lastAnulacionQuery = await sql.query(`
        SELECT ISNULL(MAX(id_anulacion), 0) AS lastIdAnulacion
        FROM anulacion_punto
        WHERE id_cliente = '${id_cliente}'
      `);

    const lastIdAnulacion = lastAnulacionQuery.recordset[0].lastIdAnulacion;
    const newIdAnulacion = lastIdAnulacion + 1;
    console.log(newIdAnulacion);

    const query = await sql.query(
      `INSERT INTO anulacion_punto (id_cliente, id_renta, id_anulacion, puntos_anulados, motivo , fecha_anulacion, id_penalidad, id_estado_a_i)
                VALUES ('${id_cliente}', '${id_renta}', '${newIdAnulacion}', '${puntos_anulados}', '${motivo}',  '${fechaActual}', '${id_penalidad}', '${1}')`
    );

    res.json({
      message: "Puntos anulados registrados con éxito",
      newIdAnulacion,
    });
  } catch (error) {
    console.log("Error inserting data", error);
    res.status(500).send("Error inserting data");
  }
};

module.exports = anulatepoints;
