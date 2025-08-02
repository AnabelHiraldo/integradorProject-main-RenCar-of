const { sql } = require("../dbConnection");

const propietario = {};

propietario.create = async (req, res) => {
  const transaction = new sql.Transaction();

  const fechaActual = new Date().toISOString().split("T")[0];
  try {
    const {
      tipo_entidad,
      nombre,
      apellido,
      fechaNacimiento,
      numeroDocumento,
      tipoDocumento,
      email,
      sexo,
      direccion,
      telefono,
    } = req.body;

    if (
      !nombre ||
      !apellido ||
      !fechaNacimiento ||
      !email ||
      !numeroDocumento
    ) {
      return res.status(400).send("Datos obligatorios faltantes.");
    }

    await transaction.begin();

    const result = await transaction
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("fechaNacimiento", sql.Date, fechaNacimiento)
      .input("email", sql.VarChar, email)
      .input("numeroDocumento", sql.VarChar, numeroDocumento)
      .input("sexo", sql.Int, sexo)
      .input("tipo_entidad", sql.Int, tipo_entidad)
      .input("tipoDocumento", sql.Int, tipoDocumento)
      .input("estado", sql.Int, 1)
      .input("fechaIngreso", sql.Date, fechaActual)
      .query(
        `INSERT INTO entidad (nombre, apellido, fechaNacimiento, email, documentoIdentidad, id_sexo, id_tipo_entidad, id_tipoDocumento, id_estado_a_i, fecha_ingreso)
          OUTPUT INSERTED.id_entidad AS lastId
          VALUES (@nombre, @apellido, @fechaNacimiento, @email, @numeroDocumento, @sexo, @tipo_entidad, @tipoDocumento, @estado, @fechaIngreso)`
      );

    const lastId = result.recordset[0].lastId;

    await transaction
      .request()
      .input("lastId", sql.Int, lastId)
      .query(
        `INSERT INTO propietario (id_entidad)
      VALUES (@lastId)`
      );
    for (const dir of direccion) {
      const { calle, descripcion_lugar, id_ciudad } = dir;

      // Obtener el último `id_direccion` asociado a la entidad
      const result = await transaction
        .request()
        .input("id_entidad", sql.Int, lastId).query(`
            SELECT ISNULL(MAX(id_direccion), 0) + 1 AS nextId
            FROM direccion
            WHERE id_entidad = @id_entidad
          `);

      const nextIdDireccion = result.recordset[0]?.nextId || 1;

      // Insertar nueva dirección
      await transaction
        .request()
        .input("id_entidad", sql.Int, lastId)
        .input("id_direccion", sql.Int, nextIdDireccion)
        .input("calle", sql.VarChar(100), calle)
        .input("descripcion_lugar", sql.VarChar(100), descripcion_lugar)
        .input("id_ciudad", sql.Int, id_ciudad)
        .input("id_estado_a_i", sql.Int, 1).query(`
            INSERT INTO direccion 
            (id_entidad, id_direccion, calle, descripcion_lugar, id_ciudad, id_estado_a_i)
            VALUES 
            (@id_entidad, @id_direccion, @calle, @descripcion_lugar, @id_ciudad, @id_estado_a_i)
          `);
    }

    for (const tel of telefono) {
      const { numero, id_tipo_telefono } = tel;

      const result = await transaction
        .request()
        .input("id_entidad", sql.Int, lastId)
        .input("id_tipo_telefono", sql.Int, id_tipo_telefono).query(`
            SELECT ISNULL(MAX(id_orden), 0) + 1 AS nextOrden
            FROM telefono
            WHERE id_entidad = @id_entidad
              AND id_tipo_telefono = @id_tipo_telefono
          `);

      const nextIdOrden = result.recordset[0]?.nextOrden || 1;

      await transaction
        .request()
        .input("id_entidad", sql.Int, lastId)
        .input("id_tipo_telefono", sql.Int, id_tipo_telefono)
        .input("id_orden", sql.Int, nextIdOrden)
        .input("numero", sql.VarChar(25), numero)
        .input("id_estado_a_i", sql.Int, 1).query(`
            INSERT INTO telefono 
            (id_entidad, id_tipo_telefono, id_orden, numero, id_estado_a_i)
            VALUES 
            (@id_entidad, @id_tipo_telefono, @id_orden, @numero, @id_estado_a_i)
          `);
    }

    await transaction.commit();

    return res.json({
      message: "Datos insertados correctamente",
      idEntidad: lastId,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    await transaction.rollback();
    res.status(500).send("Error inserting data");
  }
};

propietario.getCustomAll = async (req, res) => {
  try {
    const resultado = await sql.query(`
        SELECT 
        e.id_entidad,
        p.id_propietario,
        e.nombre,
        e.apellido,
        e.fechaNacimiento,
        e.email,
        e.documentoIdentidad,
        sex.sexo,
        tpe.nombre as tipo_entidad,
        tpd.documento,
        e.fecha_ingreso,
        p.cantidad_vehiculos
    FROM 
        entidad e
    INNER JOIN 
        propietario p ON e.id_entidad = p.id_entidad
    LEFT JOIN sexo sex on e.id_sexo = sex.id_sexo
    LEFT JOIN tipo_entidad tpe on e.id_tipo_entidad = tpe.id_tipo_entidad
    LEFT JOIN tipoDocumento tpd on e.id_tipo_entidad = tpd.id_tipoDocumento
    
    WHERE 
        e.id_estado_a_i = 1 
    ORDER BY 
        e.id_entidad;
  `);

    res.json(resultado.recordset);
  } catch (error) {
    console.log("Error Getting Data", error);
  }
};

propietario.update = async (req, res) => {
  try {
    const fechaActual = new Date().toISOString().split("T")[0];

    const {
      id_entidad,
      nombre,
      apellido,
      fechaNacimiento,
      numeroDocumento,
      tipoDocumento,
      email,
      id_sexo,
      id_estado_a_i,
      id_tipo_entidad,
      fechaIngreso,
    } = req.body;

    const resultEntidad = await sql.query(
      `UPDATE entidad
       SET nombre = '${nombre}',
           apellido = '${apellido}',
           fechaNacimiento = '${fechaNacimiento}',
           email = '${email}',
           documentoIdentidad = '${numeroDocumento}',
           id_sexo = '${id_sexo}',
           id_tipo_entidad = '${id_tipo_entidad}',
           id_tipoDocumento = '${tipoDocumento}',
           id_estado_a_i = '${id_estado_a_i}'
       WHERE id_entidad = ${id_entidad}`
    );
    console.log("Entidad actualizada:", resultEntidad.rowsAffected);

    const resultCliente = await sql.query(
      `UPDATE cliente
       SET id_estado_a_i = '${id_estado_a_i}'
       WHERE id_entidad = ${id_entidad}`
    );
    console.log("Cliente actualizado:", resultCliente.rowsAffected);

    return res.json({
      message: "Datos actualizados correctamente",
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Error updating data");
  }
};

propietario.deleteOne = async (req, res) => {};

propietario.getAll = async (req, res) => {
  try {
    const resultado = await sql.query(`
      SELECT 
   c.id_cliente,
   c.total_rentas,
   c.total_dinero,
   e.id_entidad,
   e.nombre,
   e.apellido,
   e.email,
   e.fechaNacimiento,
   e.documentoIdentidad,
   e.id_tipoDocumento
FROM 
   entidad e
JOIN 
   cliente c ON e.id_entidad = c.id_entidad;
           `);
    res.json(resultado.recordset);
  } catch (error) {
    console.log("Error Getting Data", error);
  }
};

propietario.getOne = async (req, res) => {
  try {
    const { email } = req.params;

    const entidadResult = await sql.query(
      `SELECT id_entidad FROM entidad WHERE email = '${email}'`
    );

    if (entidadResult.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el email en entidad" });
    }

    const id_entidad = entidadResult.recordset[0].id_entidad;

    const clienteResult = await sql.query(
      `SELECT id_entidad FROM cliente WHERE id_entidad = ${id_entidad}`
    );

    if (clienteResult.recordset.length === 0) {
      return res.status(404).json({
        message: "El id_entidad asociado al correo no existe en cliente",
      });
    } else {
      const resultado = await sql.query(`
       SELECT 
    e.id_entidad,
    e.nombre,
    e.apellido,
    e.email,
    e.fechaNacimiento,
    e.documentoIdentidad,
    e.id_tipoDocumento,
    e.id_sexo,
    e.id_estado_a_i,
    e.id_tipo_entidad,
    e.fecha_ingreso
FROM 
    entidad e
JOIN 
    cliente c ON e.id_entidad = c.id_entidad
JOIN 
    sexo s ON e.id_sexo = s.id_sexo           
WHERE 
    e.id_entidad = ${id_entidad}; 

            `);
      res.json(resultado.recordset);
      console.log(resultado.recordset);
    }
    //  res.json({ message: 'El id_entidad existe en cliente', id_entidad });
  } catch (error) {
    console.error("Error getting data", error);
    res.status(500).send("Error getting data");
  }
};

propietario.veirificarExist = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio." });
    }
    const query = await sql
      .connect()
      .then((pool) =>
        pool
          .request()
          .input("email", sql.VarChar(255), email)
          .execute("sp_verificar_cliente")
      );

    if (query.recordset === undefined) {
      return res.json({
        message: "El cliente no está registrado en el sistema.",
      });
    } else {
      res.json(query.recordset);
    }
  } catch (error) {
    console.log("Error getting data", error);
    res.status(500).send("Error en la ejecución del procedimiento");
  }
};

propietario.getPayPropietario = async (req, res) => {
  try {
    const resultado = await sql.query(`
select 
rrp.id_renta,
mo.modelo,
v.placa,
e.nombre,
e.apellido,
ta.nombre as tipo_de_acuerdo,
a.valor_comision_tarifa,
rrp.monto_renta,
rrp.pagar_propietario


from registro_renta_propietario rrp
inner join vehiculo v on rrp.id_vehiculo = v.id_vehiculo
inner join veersion ve on v.id_veersion = ve.id_veersion
inner join modelo mo on ve.id_modelo = mo.id_modelo
inner join propietario p on rrp.id_propietario = p.id_propietario
Left join entidad e on p.id_entidad = e.id_entidad
inner join vehiculo_consignacion vc on vc.id_vehiculo = v.id_vehiculo
inner join acuerdos a on vc.id_acuerdo = a.id_acuerdo
inner join tipo_acuerdo ta on a.id_tipo_acuerdo = ta.id_tipo_acuerdo
           `);
    res.json(resultado.recordset);
  } catch (error) {
    console.log("Error Getting Data", error);
  }
};
module.exports = propietario;
