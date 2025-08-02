const { sql } = require("../dbConnection");

const maintenanceService = {};


maintenanceService.getAllmaintenanceService = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM servicio_mantenimiento");
    res.json(result.recordset); 
  } catch (error) {
    console.error("Error al obtener los servicios:", error.message);
    res.status(500).json({ message: "Error al obtener los servicios", error: error.message });
  }
};


maintenanceService.create = async (req, res) => {
  const { nombre, descripcion} = req.body;

  if (!nombre || !descripcion ) {
    return res.status(400).json({ message: "Faltan datos requeridos para crear el servicio." });
  }

  try {
    await sql.query(
      `INSERT INTO servicio_mantenimiento(nombre, descripcion, id_estado_a_i) VALUES (@nombre, @descripcion, @id_estado_a_i)`,
      {
        input: [
          { name: "nombre", type: sql.VarChar, value: nombre },
          { name: "descripcion", type: sql.Text, value: descripcion },
          { name: "id_estado_a_i", type: sql.int, value: id_estado_a_i },
          
        ],
      }
    );
    res.json({ message: "Servicio creado exitosamente." });
  } catch (error) {
    console.error("Error al crear el servicio:", error.message);
    res.status(500).json({ message: "Error al crear el servicio", error: error.message });
  }
};



module.exports =maintenanceService;