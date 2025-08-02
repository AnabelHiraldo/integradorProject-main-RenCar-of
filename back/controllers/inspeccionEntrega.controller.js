const { sql } = require("../dbConnection");

const inspeccionEnt = {};

inspeccionEnt.create = async (req, res) => {
  const transaction = new sql.Transaction();
  const fechaActual = new Date().toISOString().split("T")[0];

  try {

    await transaction.begin();

    const {
      id_reserva = 0,
      id_vehiculo = 0,
      id_cliente = 0,
      detalles = [],
      subTotal = 0.0,
      total = 0.0,
      puntos_canjeados,
      Observaciones,
      id_tipo_inspeccion = 1,
      selectedAccessories = [],
    } = req.body;

    console.log("Detalles de la transacción:", {
      total,
      subTotal,
      selectedAccessories,
    });

    // Parsear accesorios seleccionados
    let parsedAccesorios = [];
    if (selectedAccessories) {
      try {
        parsedAccesorios = Array.isArray(selectedAccessories)
          ? selectedAccessories
          : JSON.parse(selectedAccessories);
        parsedAccesorios = parsedAccesorios.filter((id) => id && !isNaN(id));
      } catch (error) {
        console.error("Error al parsear accesorios:", error.message);
        throw new Error("Formato inválido en accesorios.");
      }
    }

    // Insertar en tabla "renta"
    const rentaQuery = await transaction
      .request()
      .input("id_cliente", sql.Int, id_cliente)
      .input("id_transaccion", sql.Int, null)
      .input("id_condicion", sql.Int, 3)
      .input("puntos_canjeados", sql.Int, puntos_canjeados || 0)
      .input("subTotal", sql.Decimal(18, 2), subTotal || 0)
      .input("total", sql.Decimal(18, 2), total || 0)
      .input("id_estado_a_i", sql.Int, 1)
      .query(`
        DECLARE @InsertedIds TABLE (lastId INT);

        INSERT INTO renta 
        (id_cliente, id_transaccion, id_condicion, puntos_canjeados, subTotal, total, id_estado_a_i)
        OUTPUT INSERTED.id_renta INTO @InsertedIds
        VALUES 
        (@id_cliente, @id_transaccion, @id_condicion, @puntos_canjeados, @subTotal, @total, @id_estado_a_i);

        SELECT lastId FROM @InsertedIds;
      `);

    const lastIdRenta = rentaQuery.recordset[0].lastId;
    console.log("ID de la renta creada:", lastIdRenta);

    // Insertar en tabla "detalle_renta"
    for (const detalle of detalles) {
      const { id_vehiculo, fechaInicio, fechaFin, precio, total_detalle } =
        detalle;

      console.log("Insertando detalle de renta:", detalle);

      await transaction
        .request()
        .input("id_renta", sql.Int, lastIdRenta)
        .input("id_vehiculo", sql.Int, id_vehiculo)
        .input("fechaInicio", sql.DateTime, fechaInicio)
        .input("fechaFin", sql.DateTime, fechaFin)
        .input("precio", sql.Decimal(10, 2), precio)
        .input("total", sql.Decimal(10, 2), total_detalle)
        .input("id_condicion", sql.Int, 10)
        .input("id_estado_a_i", sql.Int, 1)
        .query(`
          INSERT INTO detalle_renta 
          (id_renta, id_vehiculo, fechaInicio, fechaFin, precio, total, id_condicion, id_estado_a_i)
          VALUES 
          (@id_renta, @id_vehiculo, @fechaInicio, @fechaFin, @precio, @total, @id_condicion, @id_estado_a_i)
        `);
    }

    // Insertar en tabla "reserva_renta"
    await transaction
      .request()
      .input("id_reserva", sql.Int, id_reserva)
      .input("id_renta", sql.Int, lastIdRenta)
      .query(`
        INSERT INTO reserva_renta
        (id_reserva, id_renta)
        VALUES 
        (@id_reserva, @id_renta)
      `);

    // Insertar en tabla "entrega_recepcion_inspeccion"
    const entregaRecepcionQuery = await transaction
      .request()
      .input("id_renta", sql.Int, lastIdRenta)
      .input("fecha_entrega", sql.Date, fechaActual || null)
      .input("id_condicion", sql.Int, 10)
      .input("id_empleado", sql.Int, 1)
      .input("id_estado_a_i", sql.Int, 1)
      .query(`
        INSERT INTO entrega_recepcion_inspeccion (
          id_renta, 
          fecha_entrega, 
          id_condicion, 
          id_empleado, 
          id_estado_a_i
        ) 
        OUTPUT INSERTED.id_entrega_recepcion_inspeccion AS lastIdEntregaRecepcion
        VALUES (
          @id_renta, 
          @fecha_entrega, 
          @id_condicion, 
          @id_empleado, 
          @id_estado_a_i
        );
      `);

    const lastIdEntregaRecepcion =
      entregaRecepcionQuery.recordset[0].lastIdEntregaRecepcion;
    console.log("ID de la entrega recepción creada:", lastIdEntregaRecepcion);

    // Insertar equipos en "inspeccion_entrega_recepcion_inspeccion"
    for (const accesory of parsedAccesorios) {
      await transaction
        .request()
        .input("id_entrega_recepcion_inspeccion", sql.Int, lastIdEntregaRecepcion)
        .input("id_vehiculo", sql.Int, id_vehiculo)
        .input("id_tipo_inspeccion", sql.Int, id_tipo_inspeccion || 1)
        .input("id_equipo_entregado", sql.Int, accesory)
        .input("observacion", sql.Text, Observaciones || null)
        .input("id_estado_a_i", sql.Int, 1)
        .query(`
          INSERT INTO inspeccion_entrega_recepcion (
            id_entrega_recepcion_inspeccion, 
            id_vehiculo, 
            id_tipo_inspeccion, 
            id_equipo_entregado, 
            observacion, 
            id_estado_a_i
          ) 
          VALUES (
            @id_entrega_recepcion_inspeccion, 
            @id_vehiculo, 
            @id_tipo_inspeccion, 
            @id_equipo_entregado, 
            @observacion, 
            @id_estado_a_i
          );
        `);
    }

    await transaction.commit();

    res.json({
      message: "Inspección registrada con éxito",
      lastIdRenta,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error inserting Data:", error);
    res.status(500).json({ message: "Error al procesar la transacción" });
  }
};



inspeccionEnt.getAllColumn = async (req, res) => {
    try {
        const result = await sql.query(`
          Select * from equipos
        `);
        
      
        
        res.json(result.recordset)
    } catch (error) {
        console.error("Error al obtener equipos:", error);
        res.status(500).json({ error: "Error al obtener equipos de inspección." });
    }
};


inspeccionEnt.getEntregaDireccion = async (req, res) =>{
  console.log("Create")
  try {
//     const {id} = req.query
//     console.log(id)
//     const queryResult = await sql.query(`
// SELECT 
//     er.id_entrega_recepcion_inspeccion,
//     er.id_reserva,
//     er.id_renta,
//     er.fecha,
//     er.id_condicion,
//     er.id_politica_entrega,
//     er.id_empleado,
//     er.id_estado_a_i,
//     de.id_vehiculo,
//     de.id_entidad_entrega,
//     de.id_direccion_entrega,
//     de.id_lugar_comun_entrega,
// 	lc.nombre as lugar_comun_entrega,
// 	lcr.nombre as lugar_comun_recogida,
// 	de.id_lugar_comun_recogida,
//     de.direccion_externa_entrega,
//     de.fecha_entrega,
//     de.id_entidad_recogida,
//     de.id_direccion_recogida
// FROM entrega_recepcion_inspeccion er
// left JOIN detalle_entrega de ON er.id_entrega_recepcion_inspeccion = de.id_entrega_recepcion_inspeccion
// LEFT JOIN lugares_comunes lc on de.id_lugar_comun_entrega = lc.id_lugar
// LEFT JOIN lugares_comunes lcr on de.id_lugar_comun_recogida = lcr.id_lugar

// WHERE er.id_reserva = 26
//     `)
//     console.log(queryResult.recordset)
//     if(queryResult){
//       res.json(queryResult.recordset)
//     }else{
//       res.json({message: "No hay datos"})
//     }
  } catch (error) {
    console.log("Error Gettin Data", error)
  }
}
  module.exports = inspeccionEnt;