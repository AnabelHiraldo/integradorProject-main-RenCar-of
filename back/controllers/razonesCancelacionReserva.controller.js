const { sql } = require("../dbConnection");
const razones_cancelacion = {};

razones_cancelacion.getAll = async (req, res) => {
  try {
    const queryResult = await sql.query(`
        select * from razones_cancelacion where id_estado_a_i = 1
        `);
    res.json(queryResult.recordset);
  } catch (error) {
    console.log("Error inserting data", error);
  }
};

module.exports = razones_cancelacion;
