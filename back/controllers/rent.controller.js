const { sql } = require("../dbConnection");
const { fetchAllConfigPuntos } = require("../services/configPuntos.service");

const renta = {};

renta.getCustomAll = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
    r.id_renta,
    r.id_cliente,
    e.nombre AS cliente,
	emn.nombre as Empleado,
    r.id_empleado,
    r.cantidadRenovada,
    r.subTotal,
    r.total,
    r.id_condicion AS condicion_renta,
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
    renta r
INNER JOIN 
    cliente c ON r.id_cliente = c.id_cliente
INNER JOIN 
    entidad e on c.id_entidad = e.id_entidad
LEFT JOIN 
    empleado em on r.id_empleado = em.id_empleado
LEFT JOIN 
    entidad emn on emn.id_entidad = em.id_entidad
INNER JOIN 
    detalle_renta dr ON r.id_renta = dr.id_renta
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
    r.id_renta, dr.id_vehiculo;
      
      `);

    res.json(result.recordset);
  } catch (error) {
    console.log("Error Gettin Data", error);
  }
};

function calcularPunto(monto, valorPuntos, pointsMethod) {
  if (pointsMethod === 1) {
    return valorPuntos;
  } else if (pointsMethod === 2) {
    const resultado = monto / valorPuntos;

    return resultado;
  }
}

renta.create = async (req, res) => {
  const transaction = new sql.Transaction();
  const fechaActual = new Date().toISOString().split("T")[0];

  try {
    const {
      id_cliente,
      id_transaccion,
      total,
      id_empleado,
      id_condicion,
      id_estado_a_i,
      puntosCanjeados,
      detalles,
      id_metodo_pago,
      id_tipo_moneda,
      id_politica_entrega,
      fecha_entrega,
    } = req.body;

    console.log(req.body);

    const configPuntosData = await fetchAllConfigPuntos();
    const datos = configPuntosData[0];
    console.log("Datos de configPuntos:", datos);
    console.log("Cantidad minima", datos.cantRentMinima);
    const id_configuracion_puntos = datos.id_configuracion_puntos;
    console.log(datos.id_metodo_punto);

    const queryclient = await sql.query(
      `SELECT * FROM cliente WHERE id_cliente = ${id_cliente}`
    );
    const clientedata = queryclient.recordset[0];
    console.log(clientedata);

    const puntos = Math.round(
      calcularPunto(total, datos.consumo_requerido, datos.id_metodo_punto)
    );

    console.log(puntos);
    if (!id_cliente || !total || !detalles || detalles.length === 0) {
      return res.status(400).json({
        message: "Faltan datos obligatorios o el array de detalles está vacío.",
      });
    }

    await transaction.begin();

    console.log("Insertando renta con los siguientes datos:", {
      id_cliente,
      id_transaccion,
      total,
      id_empleado,
      id_condicion,
      id_estado_a_i,
    });

    const resultotal = total - puntosCanjeados;

    const rentaQuery = await transaction
      .request()
      .input("id_cliente", sql.Int, id_cliente)
      .input("id_transaccion", sql.Int, id_transaccion || null)
      .input("id_empleado", sql.Int, id_empleado || null)
      .input("id_condicion", sql.Int, id_condicion || 3)
      .input("puntos_canjeados", sql.Int, puntosCanjeados || 0)
      .input("subTotal", sql.Int, total || 0)
      .input("total", sql.Int, resultotal || 0)
      .input("id_estado_a_i", sql.Int, id_estado_a_i).query(`
      DECLARE @InsertedIds TABLE (lastId INT);
  
      INSERT INTO renta 
      (id_cliente, id_transaccion,  id_empleado, id_condicion, puntos_canjeados, subTotal, total, id_estado_a_i)
      OUTPUT INSERTED.id_renta INTO @InsertedIds
      VALUES 
      (@id_cliente, @id_transaccion, @id_empleado, @id_condicion, @puntos_canjeados, @subTotal, @total, @id_estado_a_i);
  
      SELECT lastId FROM @InsertedIds;
    `);

    const lastIdRenta = rentaQuery.recordset[0].lastId;
    console.log("ID de la renta creada:", lastIdRenta);

    //--------------------------------Insertar el Registro de puntos si cumple con la politica--------------------------

    if (parseInt(datos.id_metodo_punto) === 1) {
      const totalRent = parseInt(clientedata.total_rentas);
      const totalCantRentMinima = parseInt(datos.cantRentMinima);
      if (totalRent >= totalCantRentMinima) {
        await transaction
          .request()
          .input("id_cliente", sql.Int, id_cliente)
          .input("id_renta", sql.Int, lastIdRenta)
          .input("puntosObtenidos", sql.Int, puntos)
          .input("fecha", sql.DateTime, new Date())
          .input("id_configuracion_puntos", sql.Int, id_configuracion_puntos)
          .input("id_estado_a_i", sql.Int, 1)
          .query(
            `INSERT INTO registroPuntos 
          (id_cliente, id_renta, puntosObtenidos, fecha, id_configuracion_puntos, id_estado_a_i)
          VALUES (@id_cliente, @id_renta, @puntosObtenidos, @fecha, @id_configuracion_puntos, @id_estado_a_i)`
          );
      }
    } else if (parseInt(datos.id_metodo_punto) === 2) {
      const totalCantRentMinima = parseInt(datos.cantRentMinima);
      const totalMoney = parseInt(clientedata.total_dinero);

      if (totalMoney >= totalCantRentMinima) {
        await transaction
          .request()
          .input("id_cliente", sql.Int, id_cliente)
          .input("id_renta", sql.Int, lastIdRenta)
          .input("puntosObtenidos", sql.Int, puntos)
          .input("fecha", sql.DateTime, new Date())
          .input("id_configuracion_puntos", sql.Int, id_configuracion_puntos)
          .input("id_estado_a_i", sql.Int, 1)
          .query(
            `INSERT INTO registroPuntos 
          (id_cliente, id_renta, puntosObtenidos, fecha, id_configuracion_puntos, id_estado_a_i)
          VALUES (@id_cliente, @id_renta, @puntosObtenidos, @fecha, @id_configuracion_puntos, @id_estado_a_i)`
          );
      }
    } else {
      console.log("No cumple con las politicas");
    }

    //--------------------------------Insertar Puntos Canjeados (Si Aplica)-------------------------------------------------
    if (
      puntosCanjeados >= datos.minimoPuntoCanjear &&
      puntosCanjeados <= datos.limiteCanjeXAlquiler
    ) {
      await transaction
        .request()
        .input("id_cliente", sql.Int, id_cliente)
        .input("id_renta", sql.Int, lastIdRenta)
        .input("puntosCanjeados", sql.Int, puntosCanjeados)
        .input("fecha", sql.DateTime, new Date())
        .input("id_configuracion_puntos", sql.Int, id_configuracion_puntos)
        .input("id_estado_a_i", sql.Int, 1)
        .query(
          `INSERT INTO canjeoPuntos
     (id_cliente, id_renta, puntosCanjeados, fecha, id_configuracion_puntos, id_estado_a_i)
     VALUES (@id_cliente, @id_renta, @puntosCanjeados, @fecha, @id_configuracion_puntos, @id_estado_a_i)`
        );
    } else {
      console.log("No cumple con las Politicas");
    }

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
        .input("id_renta", sql.Int, lastIdRenta)
        // .input("id_politica_entrega", sql.Int, id_politica_entrega)
        .input("fecha", sql.DateTime, fechaActual)
        .input("id_condicion", sql.Int, id_condicion || 3)
        .input("id_estado_a_i", sql.Int, 1).query(`
           DECLARE @InsertedEntregaIds TABLE (lastId INT);
 
           INSERT INTO entrega_recepcion 
           (id_renta,  fecha, id_condicion, id_estado_a_i)
           OUTPUT INSERTED.id_entrega_recepcion INTO @InsertedEntregaIds
           VALUES 
           ( @id_renta,  @fecha, @id_condicion, @id_estado_a_i);
 
           SELECT lastId FROM @InsertedEntregaIds;
         `);

      lastIdEntrega = entregaQuery.recordset[0].lastId;
      //  console.log("ID de la entrega creada:", lastIdEntrega);
    }

    //----------------------------------------------Insertar detalle de renta------------------------------------------------------------------------

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
      } = detalle;

      if (!id_vehiculo || !fechaInicio || !fechaFin || !precio || !total) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Faltan datos en uno o más detalles de la renta.",
          detalle,
        });
      }

      console.log("Insertando detalle de renta:", detalle);

      await transaction
        .request()
        .input("id_renta", sql.Int, lastIdRenta)
        .input("id_vehiculo", sql.Int, id_vehiculo)
        .input("fechaInicio", sql.DateTime, fechaInicio)
        .input("fechaFin", sql.DateTime, fechaFin)
        .input("precio", sql.Decimal(10, 2), precio)
        .input("total", sql.Decimal(10, 2), total)
        .input("id_condicion", sql.Int, 3)
        .input("id_estado_a_i", sql.Int, 1).query(`
          INSERT INTO detalle_renta 
          (id_renta, id_vehiculo, fechaInicio, fechaFin, precio, total, id_condicion, id_estado_a_i)
          VALUES 
          (@id_renta, @id_vehiculo, @fechaInicio, @fechaFin, @precio, @total, @id_condicion, @id_estado_a_i)
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
          ${1},
          ${1},
          ${id_metodo_pago},
          ${id_tipo_moneda},
          ${lastIdRenta || "NULL"},
          ${total},
          '${fechaActual || null}',
          ${12 || 3},
          ${id_estado_a_i || 1}
      )`
    );

    await transaction.commit();

    res.json({
      message: "Renta, detalles y entrega registrados con éxito.",
      id_renta: lastIdRenta,
      id_entrega: lastIdEntrega,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(
      "Error al insertar renta, detalles o entrega:",
      error.message
    );
    res.status(500).json({
      message: "Error al insertar renta, detalles o entrega",
      error: error.message,
    });
  }
};

renta.getRentaWaitingReception = async (req, res) => {
  try {
    const queryResult = await sql.query(`
      SELECT 
      r.id_renta,
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
			v.id_color,
			v.id_vehiculo,
      CONCAT('http://localhost:3000/', REPLACE(v.imagen, '\\', '/')) AS imagen_url,
			c.id_cliente,
			ma.id_marca,
      v.id_veersion,
			mo.id_modelo,
      r.puntos_canjeados,
	  dr.id_condicion,
      dr.total as total_detalle

        FROM 
            renta r
        INNER JOIN 
            cliente c ON r.id_cliente = c.id_cliente
        INNER JOIN 
            detalle_renta dr ON r.id_renta = dr.id_renta
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
		inner join entrega_recepcion_inspeccion er on r.id_renta = er.id_renta


        WHERE 
            r.id_estado_a_i = 1
            --AND dr.fechaInicio > GETDATE()
            AND (dr.id_condicion !=6 OR dr.id_condicion IS NULL)
            AND ( er.id_condicion = 10 OR r.id_condicion IS NULL)
        ORDER BY 
            r.id_renta, dr.fechaInicio;
      `);

    res.json(queryResult.recordset);
  } catch (error) {
    // console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener los datos." });
  }
};

renta.getVehicleDispo = async (req, res) => {
  try {
    const queryResult = await sql.query(`
      SELECT 
          r.id_renta,
          c.id_cliente,
          e.nombre AS nombre_cliente,
          r.total,
          v.id_vehiculo,
          v.id_veersion,
          dr.fechaInicio,
          dr.fechaFin
      FROM 
          renta r
      INNER JOIN 
          cliente c ON r.id_cliente = c.id_cliente
      INNER JOIN 
          detalle_renta dr ON r.id_renta = dr.id_renta
      INNER JOIN 
          vehiculo v ON dr.id_vehiculo = v.id_vehiculo
      INNER JOIN 
          entidad e ON c.id_entidad = e.id_entidad
      WHERE 
          r.id_estado_a_i = 1
          AND dr.fechaInicio > GETDATE()
      ORDER BY 
          r.id_renta, dr.fechaInicio;
    `);

    res.json(queryResult.recordset);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener los datos." });
  }
};

renta.getAll = async (req, res) => {
  try {
    // Consulta SQL para obtener solo las rentas con puntos registrados
    const result = await sql.query(`
      SELECT 
        r.id_renta,
        r.id_cliente,
        r.total,
        rp.puntosObtenidos,
        rp.fecha AS fechaRegistroPuntos
      FROM renta r
      INNER JOIN registroPuntos rp
      ON r.id_renta = rp.id_renta AND r.id_cliente = rp.id_cliente
    `);

    // Retornar los datos en formato JSON
    res.json(result.recordset);
  } catch (error) {
    console.log("Error obteniendo rentas con puntos registrados:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las rentas con puntos registrados." });
  }
};

// renta.getAll = async (req, res) =>{
//   try {
//     const result = await sql.query("Select * from renta")

//     res.json(result.recordset)
//   } catch (error) {
//     console.log("Error Gettin Data", error)
//   }
// }

renta.getRentByClient = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query(`
      SELECT 
        rp.id_renta, 
        rp.id_cliente,
        rp.puntosObtenidos, 
        r.total, 
        r.fechaInicio, 
        r.fechaFin 
      FROM registroPuntos rp
      INNER JOIN renta r 
      ON rp.id_renta = r.id_renta AND rp.id_cliente = r.id_cliente
      WHERE rp.id_cliente = ${id}
    `);

    res.json(result.recordset);
  } catch (error) {
    console.log("Error obteniendo rentas por cliente:", error);
    res.status(500).json({ error: "Error al obtener las rentas del cliente." });
  }
};

renta.GetVerifyCLient = async (req, res) => {
  console.log("Toy aqui");
  try {
    const { id_cliente } = req.query;
    console.log(id_cliente);

    const queryResult = await sql.query(
      `SELECT 
          r.id_renta,
          e.nombre AS cliente,
          ma.marca AS marca,
          mo.modelo AS modelo,
          ver.veersion AS Veersion,
          co.color AS color,
          v.año,
          r.id_condicion AS condicion_renta, 
          dr.id_condicion AS condicion_detalle, 
          v.placa,
          dr.fechaInicio,
          dr.fechaFin,
          v.precio,
          r.subTotal,
          r.total,
          v.id_color,
          v.id_vehiculo,
          CONCAT('http://localhost:3000/', REPLACE(v.imagen, '\\', '/')) AS imagen_url,
          c.id_cliente,
          ma.id_marca,
          v.id_veersion,
          mo.id_modelo,
          r.puntos_canjeados,
          dr.total AS total_detalle
      FROM 
          renta r 
      INNER JOIN 
          cliente c ON r.id_cliente = c.id_cliente
      LEFT JOIN 
          detalle_renta dr ON r.id_renta = dr.id_renta 
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
          AND (dr.fechaInicio < GETDATE() AND dr.fechaFin> GETDATE() )
          AND (dr.id_condicion IS NULL OR dr.id_condicion != 6)
      ORDER BY 
          r.id_renta, dr.fechaInicio;
    `
    );
    res.json(queryResult.recordset);
  } catch ({ error }) {
    console.log("Error Getting data", error);
  }
};

renta.renovarRenta = async (req, res) => {
  try {
    const { id_renta, id_vehiculo, nuevo_costo, fechaInicio, fechaFin } =
      req.body;

    const updateRentaQuery = `
      UPDATE renta
      SET 
        cantidadRenovada = cantidadRenovada + 1,
        subTotal = subTotal + @nuevo_costo,
        total = total + @nuevo_costo
      WHERE id_renta = @id_renta
    `;

    const updateDetalleQuery = `
      UPDATE detalle_renta
      SET 
        fechaInicio = @fechaInicio,
        fechaFin = @fechaFin,
        total = total + @nuevo_costo
      WHERE id_renta = @id_renta AND id_vehiculo = @id_vehiculo
    `;

    const insertRenovacionQuery = `
      INSERT INTO renovacion (id_renta, fecha_renovacion, fecha_fin, nuevo_costo, id_conf_renovacion, id_estado_a_i)
      VALUES (@id_renta, GETDATE(), @fechaFin, @nuevo_costo, 1, 1)
    `;

    const pool = await sql.connect(); 

    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    await transaction
      .request()
      .input("id_renta", sql.Int, id_renta)
      .input("nuevo_costo", sql.Decimal(10, 2), nuevo_costo)
      .query(updateRentaQuery);

    await transaction
      .request()
      .input("id_renta", sql.Int, id_renta)
      .input("id_vehiculo", sql.Int, id_vehiculo)
      .input("nuevo_costo", sql.Decimal(10, 2), nuevo_costo)
      .input("fechaInicio", sql.DateTime, fechaInicio)
      .input("fechaFin", sql.DateTime, fechaFin) 
      .query(updateDetalleQuery);

    await transaction
      .request()
      .input("id_renta", sql.Int, id_renta)
      .input("nuevo_costo", sql.Decimal(10, 2), nuevo_costo)
      .input("fechaFin", sql.DateTime, fechaFin)
      .query(insertRenovacionQuery);

    await transaction.commit();

    res.json({ message: "Renta renovada con éxito" });
  } catch (error) {
    console.error("Error al renovar la renta:", error);
    res.status(500).json({ message: "Error al renovar la renta" });
  }
};


renta.cancelarRenta = async (req, res) => {
  const transaction = new sql.Transaction();
  try {
    const { id_renta, id_razon, penalidad } = req.body;

    await transaction.begin();

    await transaction
      .request()
      .input("id_condicion", sql.Int, 6) // Código 6: Cancelado
      .input("id_renta", sql.Int, id_renta)
      .query(`
        UPDATE renta
        SET id_condicion = @id_condicion
        WHERE id_renta = @id_renta;
      `);

    await transaction
      .request()
      .input("id_condicion", sql.Int, 6) // Código 6: Cancelado
      .input("id_renta", sql.Int, id_renta)
      .query(`
        UPDATE detalle_renta
        SET id_condicion = @id_condicion
        WHERE id_renta = @id_renta;
      `);

    await transaction
      .request()
      .input("id_renta", sql.Int, id_renta)
      .input("id_razon", sql.Int, id_razon)
      .input("rembolso", sql.Decimal(10, 2), penalidad)
      .query(`
        INSERT INTO cancelaciones_renta 
        (id_renta, id_razon, rembolso)
        VALUES (@id_renta, @id_razon, @rembolso);
      `);

    await transaction.commit();

    res.json({ message: "Renta cancelada con éxito" });
  } catch (error) {
    // Revertir cambios si hay un error
    await transaction.rollback();
    console.error("Error al cancelar la renta:", error);
    res.status(500).json({ error: "Error al cancelar la renta" });
  }
};


module.exports = renta;

// renta.getRentByClient = async (req, res) =>{
//   const {id} = req.params;
//   try {
//     const result = await sql.query(`select * from renta where id_cliente = ${id}`)

//     res.json(result.recordset)
//   } catch (error) {
//     console.log("Error Gettin Data", error)
//   }
// }
