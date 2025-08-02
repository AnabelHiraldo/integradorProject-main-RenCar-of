const { sql } = require("../dbConnection");

const parteVehiculo = {};


parteVehiculo.get = async (req, res) => {
  try {
    const query = await sql.query(`SELECT * FROM parte_vehiculo`);
    res.json(query.recordset);
  } catch (error) {
    console.log("Error al obtener los datos", error);
    res.status(500).send("Error al obtener los datos");
  }
};


parteVehiculo.create = async (req, res) => {
  const { nombre, descripcion, id_estado_a_i } = req.body;

  try {
    const query = await sql.query(`
      INSERT INTO parte_vehiculo (nombre, descripcion, id_estado_a_i) 
      VALUES ('${nombre}', '${descripcion}', ${id_estado_a_i});
    `);

    res.status(201).send("Parte de vehículo registrada exitosamente");
  } catch (error) {
    console.log("Error al insertar los datos", error);
    res.status(500).send("Error al insertar los datos");
  }
};

module.exports = parteVehiculo;
