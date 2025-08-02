const { sql } = require("../dbConnection");

const brakeSystem = {};

brakeSystem.create = async (req, res) => {
  try {
    console.log("create request body:", req.body);

    const { nombre, descripcion, id_estado_a_i } = req.body;

    if (!nombre || !id_estado_a_i) {
      return res.status(400).json({
        error: "Los campos 'nombre' y 'id_estado_a_i' son obligatorios",
      });
    }

    const query = `
      INSERT INTO sistema_freno (nombre, descripcion, id_estado_a_i)
      OUTPUT INSERTED.id_sistema_freno AS lastId
      VALUES ('${nombre}', '${descripcion}', ${id_estado_a_i})
    `;
    const result = await sql.query(query);

    const lastId = result.recordset[0].lastId;

    return res.json({
      message: "Sistema de freno registrado con éxito",
      id: lastId,
    });
  } catch (error) {
    console.error("Error inserting Data:", error.message);
    return res.status(500).send("Error al registrar el sistema de freno");
  }
};

module.exports = brakeSystem;


brakeSystem.update = async (req, res) => {
  try {
    console.log("update");
    
         const { nombre, descripcion, id_estado_a_i } = req.body;
         const { id } = req.params;
         await sql.query(
             `UPDATE sistema_freno SET nombre = '${nombre}', descripcion = '${descripcion}', id_estado_a_i = ${id_estado_a_i} WHERE id_sistema_freno = ${id}`
       );

    res.json({ message: "Sistema de freno actualizado con éxito" });
  } catch (error) {
    console.log("Error updating Data", error);
    res.status(500).send("Error updating Data");
  }
};

brakeSystem.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await sql.query(
      `SELECT * FROM sistema_freno WHERE id_sistema_freno = ${id}`
    );

    if (query.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos para actualizar" });
    }

    res.json(query.recordset[0]);
  } catch (error) {
    console.log("Error fetching Data", error);
    res.status(500).send("Error fetching Data");
  }
};

brakeSystem.getAll = async (req, res) => {
  try {
    const query = await sql.query(
      "SELECT * FROM sistema_freno"
    );

    if (query.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos" });
    }

    res.json(query.recordset);
  } catch (error) {
    console.log("Error fetching Data", error);
    res.status(500).send("Error fetching Data");
  }
};


module.exports = brakeSystem;
