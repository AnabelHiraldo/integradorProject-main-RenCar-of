const {sql} = require("../dbConnection");

async function fetchAllConfigPuntos() {
  try {
    const result = await sql.query( `
      select 
      id_configuracion_puntos,
      cantRentMinima,
      cantidad_punto,
      consumo_requerido,
      limiteCanjeXAlquiler,
      minimoPuntoCanjear,
      maximoPuntoCanjear,
      id_metodo_punto
      
      from configPuntos where id_estado_a_i = 1`);
    return result.recordset; 
  } catch (error) {
    console.error("Error fetching configPuntos:", error);
    throw error; 
  }
}

module.exports = { fetchAllConfigPuntos };
