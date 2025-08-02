const { sql } = require("../dbConnection");

const brand = {};

brand.create = async (req, res) => {
  try {
    const { marca, descripcion, id_estado_a_i } = req.body;

    const query = await sql.query(
      `INSERT INTO marca (marca, descripcion, id_estado_a_i)
         OUTPUT INSERTED.id_marca AS lastId
             VALUES ('${marca}', '${descripcion}', ${id_estado_a_i}, '${id_estado_a_i}')`
    );

    res.json({ message: "Marca registrado con éxito" });
  } catch (error) {
    console.log("Error inserting Data", error);
    res.status(500).send("Error Inserting Data");
  }
};

brand.getAll = async (req, res) => {
  try {
    const query = await sql.query(`select * from marca`);
    res.json(query.recordset);
    // res.json({ message: "Datos Obtenidos" });
  } catch (error) {
    console.log("Error gettin Data", error);
    res.status(500).send("Error gettin Data");
  }
};

brand.getOne = async (req, res) => {
  const { id } = req.params;
  const marca = await sql.query(`SELECT * FROM marca WHERE id_marca = '${id}'`);
  res.json(marca.recordset[0]);
};

brand.getBrandAll = async (req, res) => {
  try {
    const query = await sql.query(
      `SELECT m.id_marca, m.marca, m.descripcion, e.estado
FROM marca m
INNER JOIN estado_activo_inactivo e
ON m.id_estado_a_i = e.id_estado_a_i;
`
    );
    res.json(query.recordset);
    // res.json({ message: "Datos Obtenidos" });
  } catch (error) {
    console.log("Error gettin Data", error);
    res.status(500).send("Error gettin Data");
  }
};
module.exports = brand;
