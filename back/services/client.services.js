const {sql} = require("../dbConnection");

async function fetchAllClient() {
  try {
    const result = await sql.query( `
      SELECT 
   c.id_cliente,
   c.total_rentas,
   c.total_dinero,
   e.id_entidad,
   e.nombre,
   e.apellido,
   e.email,
   e.fechaNacimiento,
   e.documentoIdentidad,
   e.id_tipoDocumento
FROM 
   entidad e
JOIN 
   cliente c ON e.id_entidad = c.id_entidad,
           `);
    return result.recordset; 
  } catch (error) {
    console.error("Error fetching configPuntos:", error);
    throw error; 
  }
}

module.exports = { fetchAllClient };
