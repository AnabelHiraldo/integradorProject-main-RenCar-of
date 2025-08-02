const { sql } = require("../dbConnection");
const province = {};

province.create = async (req, res) => {
  try {
    const { id_pais, provincia, id_estado_a_i } = req.body;

    const query = await sql.query(
      `INSERT INTO provincia (id_pais, provincia, id_estado_a_i)
         OUTPUT INSERTED.id_provincia AS lastId
             VALUES ('${id_pais}', '${provincia}','${id_estado_a_i}')`
    );

    res.json({ message: "Provincia registrada con éxito" });
  } catch (error) {
    console.log("Error inserting Data", error);
    res.status(500).send("Error Inserting Data");
  }
};

province.getAll = async (req, res) => {
  try {
    const queryResult = await sql.query(
      ` select * from provincia where id_pais = 1`
    );
    res.json(queryResult.recordset)
  } catch (error) {
    console.log("Error inserting data", error);
  }
};

module.exports = province;
