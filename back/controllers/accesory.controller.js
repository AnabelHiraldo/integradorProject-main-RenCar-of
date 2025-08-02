const { sql } = require("../dbConnection");

const accesory = {};

accesory.create = async (req, res) => {
  const fechaActual = new Date().toISOString().split("T")[0];

  try {
    console.log("req.body create", req.body);

    const { nombre, descripcion, id_estado_a_i } = req.body;

    const query = await sql.query(
      `INSERT INTO accesorio (nombre, descripcion, fecha, id_estado_a_i)
              OUTPUT INSERTED.id_accesorio AS lastId
              VALUES ('${nombre}', '${descripcion}', '${fechaActual}', '${id_estado_a_i}')`
    );

    res.json({ message: "Accesorio registrado con éxito" });
  } catch (error) {
    console.log("Error inserting Data", error);
    res.status(500).send("Error Inserting Data");
  }
};

accesory.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, id_estado_a_i } = req.body;

  try {
    console.log("req.body update", req.body);
    const query = await sql.query(
      `UPDATE accesorio SET nombre = '${nombre}', descripcion = '${descripcion}', id_estado_a_i = '${id_estado_a_i}' WHERE id_accesorio = ${id}`
    );

    res.json({ message: "Accesorio actualizado con éxito" });
  } catch (error) {
    console.log("Error updating Data", error);
    res.status(500).send("Error Updating Data");
  }
};

// accesory.getOne = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const query = await sql.query(
//       `SELECT * FROM accesorio WHERE id_accesorio = ${id}`
//     );

//     res.json(query.recordset[0]);
//   } catch (error) {
//     console.log("Error getting Data", error);
//     res.status(500).send("Error Getting Data");
//   }
// };

accesory.getAll = async (req, res) => {
  try {
    const query = await sql.query(`SELECT * FROM accesorio`);

    res.json(query.recordset);
  } catch (error) {
    console.log("Error getting Data", error);
    res.status(500).send("Error Getting Data");
  }
};

accesory.byVehicle = async (req, res) => {
    const { id } = req.params;
  
    console.log("ID recibido:", id);
  
    try {
      if (!id || isNaN(id)) {
        return res.status(400).send("El ID proporcionado no es válido.");
      }
  
      const pool = await sql.connect(); 
      const query = await pool
        .request() 
        .input("id", sql.Int, parseInt(id)) 
        .query(`
          SELECT 
            va.id_vehiculo,
            va.id_accesorio,
            a.nombre
          FROM vehiculo_accesorio va
          INNER JOIN vehiculo v ON va.id_vehiculo = v.id_vehiculo
          INNER JOIN accesorio a ON a.id_accesorio = va.id_accesorio
          WHERE v.id_vehiculo = @id
        `);
  
      if (query.recordset.length === 0) {
        return res.status(404).send("No se encontraron accesorios para este vehículo.");
      }
  
      res.json(query.recordset);
    } catch (error) {
      console.error("Error getting Data", error);
      res.status(500).send("Error Getting Data");
    }
  };
  

module.exports = accesory;
