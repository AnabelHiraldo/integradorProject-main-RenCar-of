const { request } = require("express");
const { sql } = require("../dbConnection");

const VehicleMaintenance = {};

async function processServices(
  services,
  id_vehiculo,
  lastIdMantenimiento,
  costo,
  fechaInicio,
  fecha_estimada,
  id_estado_a_i
) {
  const transaction = new sql.Transaction();

  for (const s of services) {
    const { value } = s;

    sql.query(`
      INSERT INTO detalle_mantenimiento_vehiculo 
      (id_vehiculo, id_mantenimiento, id_servicio, costo, fechaInicio, fecha_estimada, id_estado_a_i)
      VALUES 
      ('${id_vehiculo}', '${lastIdMantenimiento}','${value}','${costo}','${fechaInicio}','${fecha_estimada}','${id_estado_a_i}')
    `);
  }
}

VehicleMaintenance.create = async (req, res) => {
  const transaction = new sql.Transaction();

  // console.log(req.body.detalles[0])

  try {
    const {
      id_empleado,
      costo,
      fechaMantenimiento,
      id_tipoMantenimiento,
      id_condicion,
      id_estado_a_i,
      detalles,
    } = req.body;

    if (
      !id_empleado ||
      !costo ||
      !fechaMantenimiento ||
      !id_tipoMantenimiento ||
      !id_condicion ||
      !id_estado_a_i ||
      !detalles ||
      detalles.length === 0
    ) {
      return res.status(400).json({
        message: "Faltan datos obligatorios o el array de detalles está vacío.",
      });
    }

    await transaction.begin();

    const mantenimientoQuery = await transaction
      .request()
      .input("id_empleado", sql.Int, id_empleado)
      .input("costo", sql.Decimal(10, 2), costo)
      .input("fechaMantenimiento", sql.DateTime, fechaMantenimiento)
      .input("id_tipoMantenimiento", sql.Int, id_tipoMantenimiento)
      .input("id_condicion", sql.Int, id_condicion)
      .input("id_estado_a_i", sql.Int, id_estado_a_i).query(`
        INSERT INTO mantenimiento_vehiculo 
        (id_empleado, costo, fechaMantenimiento, id_tipoMantenimiento, id_condicion, id_estado_a_i)
        OUTPUT INSERTED.id_mantenimiento AS lastId
        VALUES 
        (@id_empleado, @costo, @fechaMantenimiento, @id_tipoMantenimiento, @id_condicion, @id_estado_a_i)
      `);

    const lastIdMantenimiento = mantenimientoQuery.recordset[0].lastId;
    console.log(lastIdMantenimiento);
    for (const detalle of detalles) {
      const { id_vehiculo, costo, fechaInicio, fecha_estimada, services } =
        detalle;

      const response = await processServices(
        services,
        id_vehiculo,
        lastIdMantenimiento,
        costo,
        fechaInicio,
        fecha_estimada,
        id_estado_a_i
      );
    }

    await transaction.commit();
    res.json({
      message: "Mantenimiento y detalles registrados con éxito.",
      id_mantenimiento: lastIdMantenimiento,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(
      "Error al registrar mantenimiento y detalles:",
      error.message
    );
    res.status(500).json({
      message: "Error al registrar mantenimiento y detalles",
      error: error.message,
    });
  }
};

VehicleMaintenance.getAll = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT mv.*, e.nombre AS empleado_nombre, e.apellido AS empleado_apellido
      FROM mantenimiento_vehiculo mv
      LEFT JOIN empleado e ON mv.id_empleado = e.id_empleado
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener mantenimientos:", error.message);
    res.status(500).json({
      message: "Error al obtener mantenimientos",
      error: error.message,
    });
  }
};

VehicleMaintenance.getAllVehicle = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT id_vehiculo, placa 
      FROM vehiculo
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los vehículos:", error.message);
    res.status(500).json({
      message: "Error al obtener los vehículos",
      error: error.message,
    });
  }
};

// Obtener un empleado activo
VehicleMaintenance.getAllemployee = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id_empleado, 
        en.nombre, 
        en.apellido
      FROM empleado e
      JOIN entidad en ON e.id_entidad = en.id_entidad
      WHERE e.id_estado_a_i = 1;
    `;

    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener empleados:", error.message);
    res.status(500).json({
      message: "Error al obtener empleados",
      error: error.message,
    });
  }
};

VehicleMaintenance.getTipoMantenimiento = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tipoMantenimiento");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener tipos de mantenimiento:", error.message);
    res.status(500).json({
      message: "Error al obtener tipos de mantenimiento",
      error: error.message,
    });
  }
};

// Obtener condiciones
VehicleMaintenance.getCondition = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM condicion");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener condiciones:", error.message);
    res.status(500).json({
      message: "Error al obtener condiciones",
      error: error.message,
    });
  }
};

// Obtener servicios
VehicleMaintenance.getServices = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM servicio_mantenimiento");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener servicios:", error.message);
    res.status(500).json({
      message: "Error al obtener servicios",
      error: error.message,
    });
  }
};

VehicleMaintenance.getVehicleByPlaca = async (req, res) => {
  try {
    const { placa } = req.params;

    if (!placa) {
      return res.status(400).json({ message: "La placa es obligatoria" });
    }

    const request = new sql.Request();
    request.input("placa", sql.VarChar, placa);

    const result = await request.query(`
      SELECT 
         
          v.placa,
          m.marca AS marca,
          md.modelo AS modelo,
          vr.veersion AS veersion,
          c.color AS color,
          e.estado_activo_inactivo AS estado,
          v.año
      FROM vehiculo v
      LEFT JOIN marca m ON v.id_marca = m.id_marca
      LEFT JOIN modelo md ON v.id_modelo = md.id_modelo
      LEFT JOIN veersion vr ON v.id_veersion = vr.id_veersion
      LEFT JOIN color c ON v.id_color = c.id_color
      LEFT JOIN estado_activo_inactivo e ON v.id_estado_a_i = e.id_estado_a_i
      WHERE v.placa = @placa;
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    console.log("Vehículo encontrado:", result.recordset[0]);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error al buscar el vehículo:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

module.exports = VehicleMaintenance;
