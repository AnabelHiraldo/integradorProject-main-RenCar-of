const {sql} = require("../dbConnection")

const vehicleType ={}

vehicleType.create = async (req, res) => {
    try {
      console.log("create request body:", req.body);
  
      const { nombre, descripcion, id_estado_a_i } = req.body;
  
      if (!nombre || !id_estado_a_i) {
        return res.status(400).json({
          error: "Los campos 'nombre' y 'id_estado_a_i' son obligatorios",
        });
      }
  
      const query = await sql.query(
          `INSERT INTO tipoVehiculo (nombre, descripcion, id_estado_a_i)
           OUTPUT INSERTED.id_tipo_vehiculo AS lastId
       VALUES ('${nombre}', '${descripcion}', ${id_estado_a_i})`
      );
      const result = await sql.query(query);
  
      return res.json({
        message: "tipo de vehiculo registrado con éxito",
      });
    } catch (error) {
      console.error("Error inserting Data:", error.message);
      return res.status(500).send("Error al registrar el tipo de vehiculo");
    }
  };
  vehicleType.update = async (req, res) => {
    try {
      console.log("update");
      const { nombre, descripcion, id_estado_a_i } = req.body;

           const { id } = req.params;
           await sql.query(
               `UPDATE tipoVehiculo SET nombre = '${nombre}', descripcion = '${descripcion}', id_estado_a_i = ${id_estado_a_i} WHERE id_tipo_vehiculo = ${id}`
         );
  
      res.json({ message: "tipo de vehiculo actualizado con éxito" });
    } catch (error) {
      console.log("Error updating Data", error);
      res.status(500).send("Error updating Data");
    }
  };

  vehicleType.getOne = async (req, res) => {
    try {
      const { id } = req.params;
      const query = await sql.query(
        `SELECT * FROM tipoVehiculo WHERE id_tipo_vehiculo = ${id}`
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

  vehicleType.getAll = async (req, res) => {
    try {
      const query = await sql.query(
        "SELECT * FROM tipoVehiculo"
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


module.exports = vehicleType;