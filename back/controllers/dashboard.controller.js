const {sql} = require("../dbConnection")

const dashboardController = {};

dashboardController.getDashboardData = async (req, res) => {
  try {
    const query = `
      SELECT
          -- Contar vehículos disponibles
          (SELECT COUNT(*) 
           FROM vehiculo 
           WHERE id_estado_a_i = 1) AS vehiculos_disponibles,

          -- Contar clientes activos
          (SELECT COUNT(*) 
           FROM cliente 
           WHERE id_estado_a_i = 1) AS clientes_activos,

          -- Contar reservas pendientes
          (SELECT COUNT(*) 
           FROM reserva 
           WHERE id_condicion = 2) AS reservas_pendientes;
    `;

    const result = await sql.query(query);

    // Enviar la respuesta como JSON
    res.json({
      vehiculos_disponibles: result.recordset[0].vehiculos_disponibles,
      clientes_activos: result.recordset[0].clientes_activos,
      reservas_pendientes: result.recordset[0].reservas_pendientes,
    });
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error.message);
    res.status(500).json({
      message: "Error al obtener datos del dashboard",
      error: error.message,
    });
  }
};

dashboardController.getReservaRecientes = async (req, res)=>{
    try {
        const result = await sql.query(
            `
           SELECT 
    r.id_reserva AS ID,
    CONCAT(e.nombre, ' ', e.apellido) AS Cliente,
    CONCAT(m.marca, ' ', mo.modelo, ' ', v.veersion) AS Vehiculo,
    dr.fechaInicio AS FechaInicio,
    CASE 
        WHEN r.id_condicion = 1 THEN 'Confirmada'
        WHEN r.id_condicion = 2 THEN 'Pendiente'
        WHEN r.id_condicion = 3 THEN 'Cancelada'
        ELSE 'Desconocido'
    END AS Estado
FROM reserva r
INNER JOIN detalle_reserva dr ON r.id_reserva = dr.id_reserva
INNER JOIN vehiculo ve ON dr.id_vehiculo = ve.id_vehiculo
INNER JOIN veersion v ON ve.id_veersion = v.id_veersion
INNER JOIN modelo mo ON v.id_modelo = mo.id_modelo
INNER JOIN marca m ON mo.id_marca = m.id_marca
INNER JOIN cliente c ON r.id_cliente = c.id_cliente
INNER JOIN entidad e ON c.id_entidad = e.id_entidad -- Aquí se conecta con entidad
WHERE r.fechaReserva >= DATEADD(DAY, -5, GETDATE()) -- Últimos 3 días
ORDER BY r.fechaReserva DESC;
          `
        );

        res.json(result.recordset)
        
    } catch (error) {
        console.log("Error getting data", error)
    }
}

dashboardController.getIngresoMensual = async (req, res)=>{
try {
    const result = await sql.query(
        `
    SELECT 
        SUM(monto) AS total_ingresos_mensuales
      FROM 
        transaccion
      WHERE 
        id_tipo_movimiento = 1 
        AND MONTH(fecha) = MONTH(GETDATE()) 
        AND YEAR(fecha) = YEAR(GETDATE());
      `
    );

    res.json({
        total_ingresos_mensuales: result.recordset[0].total_ingresos_mensuales || 0,
      });} catch (error) {
    console.log("Error getting data", error)
}
}
module.exports = dashboardController;
