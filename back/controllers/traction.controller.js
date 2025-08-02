const { sql } = require("../dbConnection");

const traction ={}

traction.create = async (req, res) => {
  try {
    console.log("create request body:", req.body);

    const { traccion, descripcion, id_estado_a_i } = req.body;

    if (!traccion || !id_estado_a_i) {
      return res.status(400).json({
        error: "Los campos 'nombre' y 'id_estado_a_i' son obligatorios",
      });
    }

    const query = await sql.query(
        `INSERT INTO traccion (traccion, descripcion, id_estado_a_i)
         OUTPUT INSERTED.id_traccion AS lastId
     VALUES ('${traccion}', '${descripcion}', ${id_estado_a_i})`
    );
    const result = await sql.query(query);

    return res.json({
      message: "Sistema de freno registrado con éxito",
    });
  } catch (error) {
    console.error("Error inserting Data:", error.message);
    return res.status(500).send("Error al registrar el sistema de freno");
  }
};

traction.update = async (req, res) => {
    try {
      console.log("update");
      const { traccion, descripcion, id_estado_a_i } = req.body;

           const { id } = req.params;
           await sql.query(
               `UPDATE traccion SET traccion = '${traccion}', descripcion = '${descripcion}', id_estado_a_i = ${id_estado_a_i} WHERE id_traccion = ${id}`
         );
  
      res.json({ message: "Traccion actualizada con éxito" });
    } catch (error) {
      console.log("Error updating Data", error);
      res.status(500).send("Error updating Data");
    }
  };

  traction.getOne = async (req, res) => {
    try {
      const { id } = req.params;
      const query = await sql.query(
        `SELECT * FROM traccion WHERE id_traccion = ${id}`
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
  traction.getAll = async (req, res) => {
    try {
      const query = await sql.query(
        "SELECT * FROM traccion"
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
module.exports = traction;