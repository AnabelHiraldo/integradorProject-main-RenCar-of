const {sql} = require("../dbConnection")

const direccion={}

direccion.create = async (req, res) =>{

}

direccion.getOne = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Ejecuta la consulta
      const queryResult = await sql.query(`
        SELECT 
          d.id_direccion,
          d.calle,
          d.descripcion_lugar,
          d.id_ciudad,
          c.ciudad AS ciudad
        FROM direccion d
        INNER JOIN ciudad c ON d.id_ciudad = c.id_ciudad
        WHERE d.id_entidad = ${id}
      `);
      console.log("Resultado de la consulta:", queryResult.recordset);

      if (queryResult.recordset.length === 0) {
        return res.status(404).json({ message: "No se encontraron direcciones para esta entidad." });
      }
   
      res.json(queryResult.recordset);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
      res.status(500).json({ message: "Error obteniendo datos" });
    }
  };
  

module.exports = direccion