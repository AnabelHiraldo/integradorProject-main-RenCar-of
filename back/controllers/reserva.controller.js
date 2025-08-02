const { query } = require("mssql");
const { sql } = require("../dbConnection");
const { json } = require("express");
const { fetchAllConfigPuntos } = require("../services/configPuntos.service");
const {
  fetchAllConfigReservaPay,
} = require("../services/configPoliticaPagoReserva.service.js");

const reserva = {};

function calcularPunto(monto, valorPuntos, metodo) {
  if (metodo === 1) {
    return valorPuntos;
  } else if (metodo === 2) {
    return monto / valorPuntos;
  }
}

reserva.getAll = async (req, res) => {
  try {
    const queryResult = await sql.query(`
      SELECT 
    r.id_reserva,
    r.id_cliente,
    e.nombre AS cliente,
	emn.nombre as Empleado,
    r.id_empleado,
    r.subTotal,
    r.total,
    r.id_condicion AS condicion_reserva,
	r.fechaReserva,
    dr.id_vehiculo,
    dr.fechaInicio,
    dr.fechaFin,
    dr.precio,
	v.placa,
	co.color,
	ma.marca,
	mo.modelo,
	ver.veersion,
	con.nombre as nombre_condicion,
    dr.total AS total_detalle,
    dr.id_condicion AS condicion_detalle
FROM 
    reserva r
INNER JOIN 
    cliente c ON r.id_cliente = c.id_cliente
INNER JOIN 
    entidad e on c.id_entidad = e.id_entidad
LEFT JOIN 
    empleado em on r.id_empleado = em.id_empleado
LEFT JOIN 
    entidad emn on emn.id_entidad = em.id_entidad
INNER JOIN 
    detalle_reserva dr ON r.id_reserva = dr.id_reserva
INNER JOIN 
    vehiculo v ON dr.id_vehiculo = v.id_vehiculo
INNER JOIN 
     veersion ver ON v.id_veersion = ver.id_veersion
INNER JOIN 
     modelo mo ON mo.id_modelo = ver.id_modelo
INNER JOIN 
      marca ma ON ma.id_marca = mo.id_marca
INNER JOIN 
      color co ON co.id_color = v.id_color
LEFT JOIN
      condicion con on r.id_condicion = con.id_condicion
WHERE 
    r.id_estado_a_i = 1
ORDER BY 
    r.id_reserva, dr.id_vehiculo;
      `);
    res.json(queryResult.recordset);
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    res.status(500).json({ message: "Error al obtener las reservas" });
  }
};

reserva.create = async (req, res) => {
  const transaction = new sql.Transaction();
  const fechaActual = new Date().toISOString().split("T")[0];

  try {
    const {
      id_cliente,
      fechaReserva,
      id_transaccion,
      monto_por_la_reserva,
      origenReserva,
      id_empleado = null,
      cantidad_modificaciones = 0,
      id_condicion = 3,
      id_estado_a_i,
      puntos_canjeados,
      subTotal,
      total,
      id_metodo_pago,
      id_tipo_moneda,
      detalles,
    } = req.body;

    console.log("AQUI DATOS");
    console.log(req.body);

    // if (typeof detalles !== "object" || detalles === null || Array.isArray(detalles)) {
    //   return res
    //     .status(400)
    //     .json({ message: "El objeto de detalles no es válido" });
    // }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res
        .status(400)
        .json({ message: "El array de detalles está vacío o no es válido" });
      console.log("Aqui");
    }

    console.log("Aqui2");

    await transaction.begin();

    const configPayReservData = await fetchAllConfigReservaPay();
    const politica_pago_reserva = configPayReservData[0];
    const id_politica_pago_reserva =
      politica_pago_reserva.id_politica_pago_reserva;

    const configPuntos = await fetchAllConfigPuntos();
    const datos = configPuntos[0];
    // console.log(datos)
    let puntosCanjeados;

    if (puntos_canjeados < datos.minimoPuntoCanjear) {
      puntosCanjeados = 0;
    } else {
      puntosCanjeados = puntos_canjeados;
    }

    console.log("reserva");
    // Insertar en la tabla `reserva`
    const reservaRequest = transaction.request();
    reservaRequest.input("id_cliente", sql.Int, id_cliente);
    reservaRequest.input("fechaReserva", sql.Date, fechaReserva || fechaActual);
    reservaRequest.input("id_transaccion", sql.Int, id_transaccion || null);
    reservaRequest.input(
      "monto_por_la_reserva",
      sql.Decimal(10, 2),
      monto_por_la_reserva || 0
    );
    reservaRequest.input(
      "origenReserva",
      sql.NVarChar,
      origenReserva || "Oficina"
    );
    reservaRequest.input("id_empleado", sql.Int, null);
    reservaRequest.input("puntos_canjeados", sql.Int, puntosCanjeados || 0);
    reservaRequest.input("subTotal", sql.Decimal(10, 2), subTotal || 0);
    reservaRequest.input("total", sql.Decimal(10, 2), total || 0);
    reservaRequest.input(
      "id_politica_pago_reserva",
      sql.Int,
      id_politica_pago_reserva || null
    );
    reservaRequest.input("cantidad_modificaciones", sql.Int, 0);
    reservaRequest.input("id_condicion", sql.Int, 3);
    reservaRequest.input("id_estado_a_i", sql.Int, id_estado_a_i || 1);

    const reservaQuery = await reservaRequest.query(`
      INSERT INTO reserva 
      (id_cliente, fechaReserva, id_transaccion, monto_por_la_reserva, origenReserva, id_empleado, puntos_canjeados, subTotal, total, id_politica_pago_reserva, cantidad_modificaciones, id_condicion, id_estado_a_i)
      OUTPUT INSERTED.id_reserva AS lastId
      VALUES 
      (@id_cliente, @fechaReserva, @id_transaccion, @monto_por_la_reserva, @origenReserva, @id_empleado,@puntos_canjeados, @subTotal, @total, @id_politica_pago_reserva, @cantidad_modificaciones, @id_condicion, @id_estado_a_i)
    `);

    const lastIdReserva = reservaQuery.recordset[0]?.lastId;
    if (!lastIdReserva) {
      throw new Error("No se pudo obtener el ID de la reserva insertada.");
    }
    console.log("entrega");

    //-------------------------------- Insertar la entrega (si corresponde) ---------------------------------
    let lastIdEntrega = null;

    //Aqui  Verifico si hay una dirección seleccionada en algún detalle para registrar la entrega
    const direccionSeleccionada = detalles.find(
      (detalle) =>
        detalle.entrega !== undefined &&
        detalle.entrega !== null &&
        detalle.recogida !== undefined &&
        detalle.recogida !== null &&
        detalle.direccion !== undefined &&
        detalle.direccion !== null
    );

    if (direccionSeleccionada) {
      // console.log("Se encontró una dirección válida:", direccionSeleccionada);
    } else {
      console.log("No se encontró una dirección válida en el arreglo.");
    }

    if (direccionSeleccionada) {
      const entregaQuery = await transaction
        .request()
        .input("id_reserva", sql.Int, lastIdReserva)
        // .input("id_politica_entrega", sql.Int, id_politica_entrega)
        .input("fecha", sql.DateTime, fechaActual)
        .input("id_condicion", sql.Int, id_condicion || 6)
        .input("id_estado_a_i", sql.Int, 1).query(`
           DECLARE @InsertedEntregaIds TABLE (lastId INT);
 
           INSERT INTO entrega_recepcion 
           (id_reserva,  fecha, id_condicion, id_estado_a_i)
           OUTPUT INSERTED.id_entrega_recepcion INTO @InsertedEntregaIds
           VALUES 
           ( @id_reserva,  @fecha, @id_condicion, @id_estado_a_i);
 
           SELECT lastId FROM @InsertedEntregaIds;
         `);

      lastIdEntrega = entregaQuery.recordset[0].lastId;
      //  console.log("ID de la entrega creada:", lastIdEntrega);
    }

    console.log("detalle reserva");

    // Insertar los detalles relacionados en la tabla `detalle_reserva`
    for (const detalle of detalles) {
      const {
        id_vehiculo,
        fechaInicio,
        fechaFin,
        precio,
        total,
        entrega,
        recogida,
        direccion,
        id_estado_a_i,
      } = detalle;

      if (!id_vehiculo || !fechaInicio || !fechaFin || !precio || !total) {
        throw new Error(
          "Faltan datos obligatorios en uno de los detalles de la reserva."
        );
      }

      const detalleRequest = transaction.request();
      detalleRequest.input("id_reserva", sql.Int, lastIdReserva);
      detalleRequest.input("id_vehiculo", sql.Int, id_vehiculo);
      detalleRequest.input("fechaInicio", sql.Date, fechaInicio);
      detalleRequest.input("fechaFin", sql.Date, fechaFin);
      detalleRequest.input("precio", sql.Decimal(10, 2), precio);
      detalleRequest.input("total", sql.Decimal(10, 2), total);
      detalleRequest.input("id_estado_a_i", sql.Int, 1);

      await detalleRequest.query(`
        INSERT INTO detalle_reserva 
        (id_reserva, id_vehiculo, fechaInicio, fechaFin, precio, total, id_estado_a_i)
        VALUES 
        (@id_reserva, @id_vehiculo, @fechaInicio, @fechaFin, @precio, @total, @id_estado_a_i)
      `);

      //----------------------Insertar detalle de entrega (si aplica)---------------------------
      if (direccion && lastIdEntrega) {
        if (direccion === "Manual") {
          const detalleEntrega = transaction
            .request()
            .input("id_entrega_recepcion", sql.Int, lastIdEntrega)
            .input("id_vehiculo", sql.Int, id_vehiculo)
            .input("direccion_externa_entrega", sql.VarChar(255), entrega)
            .input("direccion_externa_recogida", sql.VarChar(255), recogida)
            .input("fecha_entrega", sql.DateTime, fechaInicio)
            .input("fecha_devolucion", sql.DateTime, fechaFin)
            .input("id_estado_a_i", sql.Int, 1);

          await detalleEntrega.query(`
            INSERT INTO detalle_entrega
            (id_entrega_recepcion, id_vehiculo, direccion_externa_entrega, direccion_externa_recogida, fecha_entrega,fecha_devolucion, id_estado_a_i)
            VALUES 
            (@id_entrega_recepcion, @id_vehiculo, @direccion_externa_entrega, @direccion_externa_recogida, @fecha_entrega, @fecha_devolucion, @id_estado_a_i)
          `);
        } else if (direccion === "Comun") {
          const detalleEntrega = transaction
            .request()
            .input("id_entrega_recepcion", sql.Int, lastIdEntrega)
            .input("id_vehiculo", sql.Int, id_vehiculo)
            .input("id_lugar_comun_entrega", sql.Int, entrega)
            .input("id_lugar_comun_recogida", sql.Int, recogida)
            .input("fecha_entrega", sql.DateTime, fechaInicio)
            .input("fecha_devolucion", sql.DateTime, fechaFin)
            .input("id_estado_a_i", sql.Int, 1);

          await detalleEntrega.query(`
            INSERT INTO detalle_entrega
            (id_entrega_recepcion, id_vehiculo, id_lugar_comun_entrega, id_lugar_comun_recogida, fecha_entrega,fecha_devolucion, id_estado_a_i)
            VALUES 
            (@id_entrega_recepcion, @id_vehiculo, @id_lugar_comun_entrega, @id_lugar_comun_recogida, @fecha_entrega, @fecha_devolucion, @id_estado_a_i)
          `);
        } else if (direccion === "Propia") {
          const detalleEntrega = transaction
            .request()
            .input("id_entrega_recepcion", sql.Int, lastIdEntrega)
            .input("id_vehiculo", sql.Int, id_vehiculo)
            .input("id_entidad_entrega", sql.Int, entrega)
            .input("id_entidad_recogida", sql.Int, recogida)
            .input("fecha_entrega", sql.DateTime, fechaInicio)
            .input("fecha_devolucion", sql.DateTime, fechaFin)
            .input("id_estado_a_i", sql.Int, 1);

          await detalleEntrega.query(`
            INSERT INTO detalle_entrega
            (id_entrega_recepcion, id_vehiculo, id_entidad_entrega, id_entidad_recogida, fecha_entrega,fecha_devolucion, id_estado_a_i)
            VALUES 
            (@id_entrega_recepcion, @id_vehiculo, @id_entidad_entrega, @id_entidad_recogida, @fecha_entrega, @fecha_devolucion, @id_estado_a_i)
          `);
        }
      }
    }

    if (monto_por_la_reserva > 0) {
      const query = await sql.query(
        `INSERT INTO transaccion (
            id_tipo_transaccion,
            id_tipo_movimiento,
            id_metodo_pago,
            id_tipo_moneda,
            id_referencia,
            monto,
            fecha,
            id_condicion,
            id_estado_a_i
        )
        OUTPUT INSERTED.id_transaccion AS lastId
        VALUES (
            ${2},
            ${1},
            ${id_metodo_pago || 1},
            ${id_tipo_moneda || 2},
            ${lastIdReserva || "NULL"},
            ${monto_por_la_reserva},
            '${fechaActual || null}',
            ${12 || 3},
            ${id_estado_a_i || 1}
        )`
      );
    }

    await transaction.commit();

    res.json({
      message: "Reserva y detalles registrados con éxito",
      id_reserva: lastIdReserva,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al insertar reserva y detalles:", error);
    res.status(500).json({ message: "Error al insertar reserva y detalles" });
  }
};

reserva.getByCliente = async (req, res) => {
  console.log("LLEGUE");
  try {
    const { id_cliente } = req.query;

    if (!id_cliente) {
      return res.status(400).json({ message: "Falta el id del cliente." });
    }

    const queryResult = await sql.query(`
     
SELECT 
    r.id_reserva,
    r.fechaReserva,
    e.nombre AS cliente,
    ma.marca AS marca,
    mo.modelo AS modelo,
    ver.veersion AS Veersion,
    co.color AS color,
    v.año,
    r.id_condicion,
    dr.id_condicion,
    v.placa,
    dr.fechaInicio,
    dr.fechaFin,
    v.precio,
    r.subTotal,
    r.total,
    r.OrigenReserva,
    v.id_color,
    v.id_vehiculo,
    CONCAT('http://localhost:3000/', REPLACE(v.imagen, '\\', '/')) AS imagen_url,
    c.id_cliente,
    ma.id_marca,
    v.id_veersion,
    mo.id_modelo,
    r.puntos_canjeados,
    r.monto_por_la_reserva,
    dr.total AS total_detalle

FROM 
    reserva r
INNER JOIN 
    cliente c ON r.id_cliente = c.id_cliente
LEFT JOIN 
    detalle_reserva dr ON r.id_reserva = dr.id_reserva
INNER JOIN 
    vehiculo v ON dr.id_vehiculo = v.id_vehiculo
INNER JOIN 
    entidad e ON c.id_entidad = e.id_entidad
INNER JOIN 
    veersion ver ON v.id_veersion = ver.id_veersion
INNER JOIN 
    modelo mo ON mo.id_modelo = ver.id_modelo
INNER JOIN 
    marca ma ON ma.id_marca = mo.id_marca
INNER JOIN 
    color co ON co.id_color = v.id_color

WHERE 
    r.id_estado_a_i = 1 
    AND r.id_cliente = ${id_cliente} 
    AND dr.fechaFin > GETDATE()  
	AND dr.id_condicion is null or dr.id_condicion != 6
  
    AND (dr.id_condicion != 5 OR dr.id_condicion IS NULL)  -- Filtros adicionales de condición
    AND (r.id_condicion != 5 OR r.id_condicion IS NULL)  -- Filtros adicionales de condición
    AND (dr.id_condicion != 10 OR dr.id_condicion IS NULL)  -- Filtros adicionales de condición
    AND (r.id_condicion != 10 OR r.id_condicion IS NULL)  -- Filtros adicionales de condición

ORDER BY 
    r.id_reserva, dr.fechaInicio;

      `);

    res.json(queryResult.recordset);
  } catch (error) {
    throw new Error("Error al obtener las reservas del cliente");
  }
};

reserva.getReservaDispo = async (req, res) => {
  try {
    const queryResult = await sql.query(`
       SELECT 
      r.id_reserva,
			r.fechaReserva,
      e.nombre AS cliente,
			ma.marca as marca,
			mo.modelo as modelo,
			ver.veersion as Veersion,
		  co.color as color,
			v.año,
      v.placa,
			dr.fechaInicio,
      dr.fechaFin,
			v.precio,
      r.subTotal,
			r.total,
      r.OrigenReserva,
			v.id_color,
			v.id_vehiculo,
      CONCAT('http://localhost:3000/', REPLACE(v.imagen, '\\', '/')) AS imagen_url,
			c.id_cliente,
			ma.id_marca,
      v.id_veersion,
			mo.id_modelo,
      r.puntos_canjeados,
      r.monto_por_la_reserva,
      dr.total as total_detalle

        FROM 
            reserva r
        INNER JOIN 
            cliente c ON r.id_cliente = c.id_cliente
        INNER JOIN 
            detalle_reserva dr ON r.id_reserva = dr.id_reserva
        INNER JOIN 
            vehiculo v ON dr.id_vehiculo = v.id_vehiculo
        INNER JOIN 
            entidad e ON c.id_entidad = e.id_entidad
		INNER JOIN 
		    veersion ver ON v.id_veersion = ver.id_veersion
		INNER JOIN 
		    modelo mo ON mo.id_modelo = ver.id_modelo
		INNER JOIN 
		    marca ma ON ma.id_marca = mo.id_marca
		INNER JOIN 
		    color co ON co.id_color = v.id_color

        WHERE 
            r.id_estado_a_i = 1
            AND dr.fechaInicio > GETDATE()
            AND (dr.id_condicion != 6 OR dr.id_condicion IS NULL)
            AND (r.id_condicion != 6 OR r.id_condicion IS NULL)
        ORDER BY 
            r.id_reserva, dr.fechaInicio;
      `);

    res.json(queryResult.recordset);
  } catch (error) {
    // console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener los datos." });
  }
};

// ------------------------------------------------Actualizar la reserva---------------------------------------------------------

reserva.update = async (req, res) => {
  try {
    const { id_reserva, detalles, total } = req.body;

    if (!id_reserva || !detalles) {
      return res
        .status(400)
        .json({ message: "Faltan parámetros necesarios en la solicitud." });
    }

    const pool = await sql.connect();

    const { recordset: vehiculosExistentes } = await pool
      .request()
      .input("id_reserva", sql.Int, id_reserva)
      .query(
        `
        SELECT 
          id_vehiculo, fechaInicio, fechaFin, precio 
        FROM detalle_reserva 
        WHERE id_reserva = @id_reserva
        `
      );

    const { recordset: modificacionesResult } = await pool
      .request()
      .input("id_reserva", sql.Int, id_reserva)
      .query(
        `
        SELECT 
          cantidad_modificaciones 
        FROM reserva 
        WHERE id_reserva = @id_reserva
        `
      );

    let modificaciones = modificacionesResult[0]?.cantidad_modificaciones || 0;
    let totalReserva = 0;

    const idsVehiculosEnviados = detalles.map((detalle) => detalle.id_vehiculo);
    const vehiculosEliminados = vehiculosExistentes.filter(
      (vehiculo) => !idsVehiculosEnviados.includes(vehiculo.id_vehiculo)
    );

    for (const detalle of detalles) {
      const vehiculoExistente = vehiculosExistentes.find(
        (v) => v.id_vehiculo === detalle.id_vehiculo
      );

      const fechaInicio = new Date(detalle.fechaInicio);
      const fechaFin = new Date(detalle.fechaFin);

      const diasReserva = Math.ceil(
        (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)
      );

      const totalDetalle = diasReserva * detalle.precio;

      if (vehiculoExistente) {
        // Si el vehículo ya existe, solo actualizo las fechas y el total del detalle
        await pool
          .request()
          .input("id_reserva", sql.Int, id_reserva)
          .input("id_vehiculo", sql.Int, detalle.id_vehiculo)
          .input("fechaInicio", sql.Date, detalle.fechaInicio)
          .input("fechaFin", sql.Date, detalle.fechaFin)
          .input("total", sql.Decimal(18, 2), totalDetalle)
          .query(
            `
            UPDATE detalle_reserva 
            SET fechaInicio = @fechaInicio, 
                fechaFin = @fechaFin, 
                total = @total 
            WHERE id_reserva = @id_reserva AND id_vehiculo = @id_vehiculo
            `
          );
      } else {
        // Si el vehículo no existe, inserto un nuevo detalle
        await pool
          .request()
          .input("id_reserva", sql.Int, id_reserva)
          .input("id_vehiculo", sql.Int, detalle.id_vehiculo)
          .input("fechaInicio", sql.Date, detalle.fechaInicio)
          .input("fechaFin", sql.Date, detalle.fechaFin)
          .input("precio", sql.Decimal(18, 2), detalle.precio)
          .input("total", sql.Decimal(18, 2), totalDetalle)
          .input("id_estado_a_i", sql.Int, 1)

          .query(
            `
            INSERT INTO detalle_reserva 
            (id_reserva, id_vehiculo, fechaInicio, fechaFin, precio, total, id_estado_a_i) 
            VALUES (@id_reserva, @id_vehiculo, @fechaInicio, @fechaFin, @precio, @total, @id_estado_a_i)
            `
          );
      }

      totalReserva += totalDetalle;
      modificaciones++;
    }

    //Cambio la condicion a cancelado si se cambia el vehiculo actual
    const id_condicionn = 6;

    for (const vehiculo of vehiculosEliminados) {
      await pool
        .request()
        .input("id_reserva", sql.Int, id_reserva)
        .input("id_vehiculo", sql.Int, vehiculo.id_vehiculo)
        .input("id_condicion", sql.Int, id_condicionn)
        .query(
          `
          UPDATE detalle_reserva 
          SET id_condicion = @id_condicion
          WHERE id_reserva = @id_reserva AND id_vehiculo = @id_vehiculo
          `
        );
    }

    //--------------Actualizo la tabla reserva----------------------------
    await pool
      .request()
      .input("id_reserva", sql.Int, id_reserva)
      .input("total", sql.Decimal(18, 2), totalReserva)
      .input("modificaciones", sql.Int, modificaciones)
      .query(
        `
        UPDATE reserva 
        SET total = @total, 
            cantidad_modificaciones = @modificaciones
        WHERE id_reserva = @id_reserva
        `
      );

    res.json({
      message: "Reserva actualizada exitosamente.",
      totalReserva,
      modificaciones,
    });
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

reserva.cancelarReserva = async (req, res) => {
  const transaction = new sql.Transaction();
  try {
    const { id_reserva, id_razon, penalidad } = req.body;

    await transaction.begin();

    await transaction
      .request()
      .input("id_condicion", sql.Int, 6)
      .input("id_reserva", sql.Int, id_reserva).query(`
        UPDATE reserva
        SET id_condicion = @id_condicion
        WHERE id_reserva = @id_reserva;
      `);

    await transaction
      .request()
      .input("id_condicion", sql.Int, 6)
      .input("id_reserva", sql.Int, id_reserva).query(`
        UPDATE detalle_reserva
        SET id_condicion = @id_condicion
        WHERE id_reserva = @id_reserva;
      `);

    await transaction
      .request()
      .input("id_reserva", sql.Int, id_reserva)
      .input("id_razon", sql.Int, id_razon)
      .input("penalidad", sql.Decimal(10, 2), penalidad)
      .query(`
        INSERT INTO cancelaciones 
        (id_reserva,
         id_razon,
         penalidad
        )
        values(
        @id_reserva,
        @id_razon,
        @penalidad

        )`);

        res.json({message: "Reserva Cancelada con exito"})
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.log("Error en reserva cancelar", error);
  }
};

module.exports = reserva;
