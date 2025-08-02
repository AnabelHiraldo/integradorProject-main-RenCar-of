const { sql } = require("../dbConnection");

async function fetchAllConfigReservaPay() {
  try {
    const result = await sql.query(
      `Select * from politica_pago_reserva where id_estado_a_i = 1`
    );
    return result.recordset;
  } catch (error) {
    console.error("Error fetching configPuntos:", error);
    throw error; 
  }
}

module.exports = { fetchAllConfigReservaPay };
