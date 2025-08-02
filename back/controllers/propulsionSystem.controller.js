const { query } = require("express")
const {sql} = require("../dbConnection")

const propulsion={}


propulsion.create = async (req, res) => {
    try {
      console.log("create request body:", req.body);
  
      const { nombre, descripcion, id_estado_a_i } = req.body;
  
      if (!nombre || !id_estado_a_i) {
        return res.status(400).json({
          error: "Los campos 'nombre' y 'id_estado_a_i' son obligatorios",
        });
      }
  
      const query = await sql.query(
      `INSERT INTO tipoPropulsion (nombre, descripcion, id_estado_a_i)
       VALUES ('${nombre}', '${descripcion}', ${id_estado_a_i})`
      );
      const result = await sql.query(query);
  
      return res.json({
        message: "Tipo de propulsion registrada con éxito",
      });
    } catch (error) {
      console.error("Error inserting Data:", error.message);
      return res.status(500).send("Error al registrar");
    }
  };
  
  propulsion.update = async (req, res) => {
      try {
        console.log("update");
        const { nombre, descripcion, id_estado_a_i } = req.body;
  
             const { id } = req.params;
             await sql.query(
                 `UPDATE tipoPropulsion SET nombre = '${nombre}', descripcion = '${descripcion}', id_estado_a_i = ${id_estado_a_i} WHERE id_tipoPropulsion = ${id}`
           );
    
        res.json({ message: "Tipo de propulsion actualizada con éxito" });
      } catch (error) {
        console.log("Error updating Data", error);
        res.status(500).send("Error updating Data");
      }
    };
  
    propulsion.getOne = async (req, res) => {
      try {
        const { id } = req.params;
        const query = await sql.query(
          `SELECT * FROM tipoPropulsion WHERE id_tipoPropulsion = ${id}`
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

    propulsion.getAll = async (req, res) => {
      try {
        const query = await sql.query(
          "SELECT * FROM tipoPropulsion"
        );
    
        if (query.recordset.length === 0) {
          return res
            .status(404)
            .json({ message: "No se encontraron datos" });
        }
    
        res.json(query.recordset);
      } catch (error) {
        console.log("Error fetching Dataaa", error);
        res.status(500).send("Error fetching Dataaaa");
      }
    };
  module.exports = propulsion;
