const { sql } = require("../dbConnection");

const express = require("express");

const vehicle = {};

vehicle.create = async (req, res) => {
  try {
    const {
      matricula = "",
      numChasis = "",
      placa = "",
      id_veersion = null,
      año = null,
      numPuertas = null,
      capacidadPersonas = null,
      precio = null,
      kilometraje_actual = null,
      capacidad_combustible = "",
      capacidad_carga_peso = "",
      id_color = null,
      id_sistema_freno = null,
      id_traccion = null,
      id_tipoPropulsion = null,
      id_tipo_transmision = null,
      id_estado_a_i = null,
      propio,
      id_propietario,
      id_acuerdo,
      ruta_archivo,
    } = req.body;


    let rutaArray
    if (typeof ruta_archivo === "object" && ruta_archivo !== null) {
       rutaArray = Object.values(ruta_archivo); 
      rutaArray.forEach((item) => {
        // console.log("Elemento de ruta_archivo:", item);
      });
    } else {
      console.log("No se puede convertir ruta_archivo a un arreglo");
    }
    
    // let id = Array( ruta_archivo)

    // console.log("Datos recibidos:", req.body);

    const normalizedAño = req.body["aÃ±o"] || año;
    // const imagePath = req.file ? req.file.path : null; ESTE ES EL ORIGINAL


    const imagePath = req.files?.imagen?.[0]?.path || null;
    console.log("Imagen principal guardada en:", imagePath);
    // Archivos adicionales
    const archivosAdicionales = req.files?.ruta_archivo || [];
    console.log("Archivos adicionales:", archivosAdicionales);
  
    archivosAdicionales.forEach((archivo, index) => {
      console.log(`Archivo adicional ${index + 1}:`, {
        nombre: archivo.originalname,
        ruta: archivo.path,
        tipo: archivo.mimetype,
        id_tipo_archivo: rutaArray[index],
      });
    });

    let parsedAccesorios = [];
    if (req.body.accesorios) {
      try {
        parsedAccesorios = Array.isArray(req.body.accesorios)
          ? req.body.accesorios.map(Number)
          : JSON.parse(req.body.accesorios).map(Number);
        parsedAccesorios = parsedAccesorios.filter((id) => id && !isNaN(id));
      } catch (error) {
        console.error("Error al parsear accesorios:", error.message);
        res.status(400).json({ message: "Formato inválido en accesorios" });
        return;
      }
    }

    console.log("Accesorios procesados:", parsedAccesorios);

    // Crear una nueva solicitud
    const request = new sql.Request();

    // Insertar vehículo
    const query = await request
      .input("matricula", sql.NVarChar, matricula)
      .input("numChasis", sql.NVarChar, numChasis)
      .input("placa", sql.NVarChar, placa)
      .input("id_veersion", sql.Int, id_veersion)
      .input("año", sql.Int, normalizedAño)
      .input("numPuertas", sql.Int, numPuertas)
      .input("capacidadPersonas", sql.Int, capacidadPersonas)
      .input("precio", sql.Decimal(18, 2), precio)
      .input("kilometraje_actual", sql.Int, kilometraje_actual)
      .input("capacidad_combustible", sql.NVarChar, capacidad_combustible)
      .input("capacidad_carga_peso", sql.NVarChar, capacidad_carga_peso)
      .input("id_color", sql.Int, id_color)
      .input("id_sistema_freno", sql.Int, id_sistema_freno)
      .input("id_traccion", sql.Int, id_traccion)
      .input("id_tipoPropulsion", sql.Int, id_tipoPropulsion)
      .input("id_tipo_transmision", sql.Int, id_tipo_transmision)
      .input("id_estado_a_i", sql.Int, id_estado_a_i)
      .input("imagen", sql.NVarChar, imagePath)
      .query(`
        INSERT INTO vehiculo (
          matricula, numChasis, placa, id_veersion, año, numPuertas, capacidadPersonas, precio, kilometraje_actual, capacidad_combustible, capacidad_carga_peso, id_color, id_sistema_freno, id_traccion, id_tipoPropulsion, id_tipo_transmision, id_estado_a_i, imagen
        )
        OUTPUT INSERTED.id_vehiculo AS lastId
        VALUES (
          @matricula, @numChasis, @placa, @id_veersion, @año, @numPuertas, @capacidadPersonas, @precio, @kilometraje_actual, @capacidad_combustible, @capacidad_carga_peso, @id_color, @id_sistema_freno, @id_traccion, @id_tipoPropulsion, @id_tipo_transmision, @id_estado_a_i, @imagen
        )
      `);

    const lastId = query.recordset[0].lastId;
    console.log("ID del vehículo insertado:", lastId);

    // Insertar accesorios
    for (const accesory of parsedAccesorios) {
      await new sql.Request()
        .input("id_vehiculo", sql.Int, lastId)
        .input("id_accesorio", sql.Int, accesory)
        .input("id_estado_a_i", sql.Int, id_estado_a_i)
        .query(`
          INSERT INTO vehiculo_accesorio (id_vehiculo, id_accesorio, id_estado_a_i)
          VALUES (@id_vehiculo, @id_accesorio, @id_estado_a_i)
        `);
    }

    if (id_propietario && id_acuerdo) {
      await new sql.Request()
        .input("id_propietario", sql.Int, id_propietario)
        .input("id_vehiculo", sql.Int, lastId)
        .input("id_acuerdo", sql.Int, id_acuerdo)
        .query(`
          INSERT INTO vehiculo_consignacion (id_propietario, id_vehiculo, id_acuerdo)
          VALUES (@id_propietario, @id_vehiculo, @id_acuerdo)
        `);

      console.log("Vehículo consignado registrado correctamente.");
    }
  

    if (!archivosAdicionales || archivosAdicionales.length === 0) {
      console.log("No se recibieron archivos adicionales. No se realiza inserción.");
      return;
    }

    const pool = await sql.connect(); // Conectar a la base de datos

    for (let index = 0; index < archivosAdicionales.length; index++) {
      const archivo = archivosAdicionales[index];
      const idTipoArchivo = rutaArray[index]; 

      if (!idTipoArchivo) {
        console.log(`ID de tipo de archivo no proporcionado para el archivo ${archivo.originalname}.`);
        continue; // Saltar archivos sin ID de tipo
      }

      const numArchivoResult = await pool
        .request()
        .input("id_vehiculo", sql.Int, lastId)
        .query(`
          SELECT ISNULL(MAX(num_archivo), 0) + 1 AS nextNumArchivo
          FROM vehiculos_archivos
          WHERE id_vehiculo = @id_vehiculo
        `);

      const numArchivo = numArchivoResult.recordset[0].nextNumArchivo;

      // Insertar el archivo adicional
      await pool
        .request()
        .input("id_vehiculo", sql.Int, lastId)
        .input("id_tipo_archivo", sql.Int, idTipoArchivo)
        .input("num_archivo", sql.Int, numArchivo)
        .input("nombre_archivo", sql.VarChar(255), archivo.originalname)
        .input("ruta_archivo", sql.VarChar(255), archivo.path)
        .input("id_estado_a_i", sql.Int, 1) // Estado activo por defecto
        .query(`
          INSERT INTO vehiculos_archivos (
            id_vehiculo,
            id_tipo_archivo,
            num_archivo,
            nombre_archivo,
            ruta_archivo,
            fecha_subida,
            id_estado_a_i
          ) VALUES (
            @id_vehiculo,
            @id_tipo_archivo,
            @num_archivo,
            @nombre_archivo,
            @ruta_archivo,
            GETDATE(),
            @id_estado_a_i
          )
        `);

      console.log(`Archivo ${archivo.originalname} insertado correctamente.`);
    }

    
    res.json({
      message: "Vehículo registrado con éxito",
      id_vehiculo: lastId,
    });
  } catch (error) {
    console.error("Error al insertar datos en vehiculo:", error);
    res.status(500).json({ message: "Error al insertar datos en vehiculo" });
  }
};



vehicle.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      matricula,
      numChasis,
      placa,
      id_veersion,
      año,
      numPuertas,
      capacidadPersonas,
      image,
      precio,
      kilometraje_actual,
      capacidad_combustible,
      capacidad_carga_peso,
      id_color,
      id_condicion,
      id_sistema_freno,
      id_traccion,
      id_tipoPropulsion,
      id_tipo_transmision,
      id_estado_a_i,
    } = req.body;

    await sql.query(
      `UPDATE vehiculo 
         SET matricula = '${matricula}', 
             numChasis = '${numChasis}', 
             placa = '${placa}', 
             id_veersion = '${id_veersion}', 
             año = '${año}', 
             numPuertas = '${numPuertas}', 
             capacidadPersonas = '${capacidadPersonas}', 
             imagen = ${image ? `'${image}'` : null}, 
             precio ='${precio}', 
             kilometraje_actual = '${kilometraje_actual}',
             capacidad_combustible = '${capacidad_combustible}', 
             capacidad_carga_peso = '${capacidad_carga_peso}', 
             id_color = '${id_color}', 
             id_condicion = '${id_condicion || 2}', 
             id_sistema_freno = '${id_sistema_freno}',
             id_traccion = '${id_traccion}',
             id_tipoPropulsion = '${id_tipoPropulsion}',
             id_tipo_transmision = '${id_tipo_transmision}', 
             id_estado_a_i ='${id_estado_a_i}'
         WHERE id_vehiculo = ${id}`
    );
    res.json({ message: "Vehículo actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar vehículo:", error);
    res.status(500).json({ message: "Error al actualizar vehículo" });
  }
};

// vehicle.getAll = async (req, res) => {
//   try {
//     const query = await sql.query(`
//       SELECT
//         v.id_vehiculo,
//         v.matricula,
//         v.numChasis,
//         v.placa,
//         v.año,
//         v.numPuertas,
//         v.capacidadPersonas,
//         v.kilometraje_actual,
//         v.capacidad_combustible,
//         v.capacidad_carga_peso,
//         v.precio,
//         CONCAT('${req.protocol}://${req.get("host")}/uploads/', v.imagen) AS imagen_url,
//         c.nombre AS categoria,
//         m.marca AS marca,
//         mo.modelo AS modelo,
//         ver.veersion AS veersion,
//         col.color AS color,
//         v.id_condicion,
//         sf.nombre AS sistema_freno,
//         t.traccion AS traccion,
//         tp.nombre AS tipo_propulsion,
//         tt.tipo AS tipo_transmision
//       FROM
//         vehiculo v
//       INNER JOIN veersion ver ON v.id_veersion = ver.id_veersion
//       INNER JOIN modelo mo ON ver.id_modelo = mo.id_modelo
//       INNER JOIN marca m ON mo.id_marca = m.id_marca
//       INNER JOIN categoria c ON mo.id_categoria = c.id_categoria
//       INNER JOIN color col ON v.id_color = col.id_color
//       INNER JOIN sistema_freno sf ON v.id_sistema_freno = sf.id_sistema_freno
//       INNER JOIN traccion t ON v.id_traccion = t.id_traccion
//       INNER JOIN tipoPropulsion tp ON v.id_tipoPropulsion = tp.id_tipoPropulsion
//       INNER JOIN tipo_transmision tt ON v.id_tipo_transmision = tt.id_tipo_transmision
//     `);

//     res.json(query.recordset);
//   } catch (error) {
//     console.error("Error Getting Data", error);
//     res.status(500).json({ message: "Error al obtener los datos" });
//   }
// };
vehicle.getAll = async (req, res) => {
  try {
    const query = await sql.query(`
      SELECT 
        v.id_vehiculo,
        v.matricula,
        v.numChasis,
        v.placa,
        v.año,
        v.numPuertas,
        v.capacidadPersonas,
        v.kilometraje_actual,
        v.capacidad_combustible,
        v.capacidad_carga_peso,
        v.precio,
        CONCAT('http://localhost:3000/', REPLACE(v.imagen, '\\', '/')) AS imagen_url,
        c.nombre AS categoria,
        m.marca AS marca,
        mo.modelo AS modelo,
        ver.veersion AS veersion,
        col.color AS color,
        v.id_condicion,
        sf.nombre AS sistema_freno,
        t.traccion AS traccion,
        tp.nombre AS tipo_propulsion,
        tt.tipo AS tipo_transmision
      FROM 
        vehiculo v
      INNER JOIN veersion ver ON v.id_veersion = ver.id_veersion
      INNER JOIN modelo mo ON ver.id_modelo = mo.id_modelo
      INNER JOIN marca m ON mo.id_marca = m.id_marca
      INNER JOIN categoria c ON mo.id_categoria = c.id_categoria
      INNER JOIN color col ON v.id_color = col.id_color
      INNER JOIN sistema_freno sf ON v.id_sistema_freno = sf.id_sistema_freno
      INNER JOIN traccion t ON v.id_traccion = t.id_traccion
      INNER JOIN tipoPropulsion tp ON v.id_tipoPropulsion = tp.id_tipoPropulsion
      INNER JOIN tipo_transmision tt ON v.id_tipo_transmision = tt.id_tipo_transmision
    `);

    res.json(query.recordset);
  } catch (error) {
    console.error("Error Getting Data", error);
    res.status(500).send("Error Getting Data");
  }
};

vehicle.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const query = await sql.query(
      ` 
SELECT 
v.*,
STRING_AGG(va.id_accesorio, ',') AS accesorios
FROM 
vehiculo v
LEFT JOIN 
vehiculo_accesorio va 
ON 
va.id_vehiculo = v.id_vehiculo
WHERE 
v.id_vehiculo = '${id}'
GROUP BY 
v.id_vehiculo, v.matricula, v.numChasis, 
v.placa, v.id_veersion, v.año, v.numPuertas,
v.capacidadPersonas, v.imagen, v.precio,
v.kilometraje_actual, v.capacidad_combustible,
v.capacidad_carga_peso, v.id_condicion, v.id_color,
v.id_sistema_freno, v.id_traccion, v.id_tipoPropulsion,
v.id_tipo_transmision, v.id_estado_a_i
      `
    );

    const reulst = query.recordset[0];
    console.log(reulst);
    const accesorios = reulst.accesorios ? reulst.accesorios.split(",") : [];
    for (const array of accesorios) {
      console.log(array);
    }
    if (query.recordset.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    res.json(query.recordset[0]);
  } catch (error) {
    console.error("Error al obtener el vehículo:", error);
    res.status(500).json({ message: "Error al obtener el vehículo" });
  }
};

vehicle.getEspecial = async (req, res) => {
  try {
    const { id_marca, id_modelo, id_version, fecha } = req.params;

    console.log("ID Marca:", id_marca);
    console.log("ID Modelo:", id_modelo);
    console.log("ID Versión:", id_version);
    console.log("Fecha:", fecha);

    if (!fecha || !id_marca || !id_modelo || !id_version) {
      return res
        .status(400)
        .json({ message: "Faltan parámetros necesarios en la solicitud." });
    }

    const query = await sql.connect().then((pool) =>
      pool
        .request()
        .input("id_marca", sql.Int, id_marca)
        .input("id_modelo", sql.Int, id_modelo)
        .input("id_version", sql.Int, id_version)
        .input("fecha", sql.Date, fecha)
        .query(
          `
            SELECT 
              v.id_vehiculo,
              v.matricula,
              v.numChasis,
              v.placa,
              v.año,
              v.numPuertas,
              v.capacidadPersonas,
              v.kilometraje_actual,
              v.capacidad_combustible,
              v.capacidad_carga_peso,
              v.precio,
              c.nombre AS categoria,
              m.marca AS marca,
              mo.modelo AS modelo,
              ver.veersion AS veersion,
              col.color AS color,
              v.id_condicion,
              sf.nombre AS sistema_freno,
              t.traccion AS traccion,
              tp.nombre AS tipo_propulsion,
              tt.tipo AS tipo_transmision
            FROM 
              vehiculo v
            INNER JOIN veersion ver ON v.id_veersion = ver.id_veersion
            INNER JOIN modelo mo ON ver.id_modelo = mo.id_modelo
            INNER JOIN marca m ON mo.id_marca = m.id_marca
            INNER JOIN categoria c ON mo.id_categoria = c.id_categoria
            INNER JOIN color col ON v.id_color = col.id_color
            INNER JOIN sistema_freno sf ON v.id_sistema_freno = sf.id_sistema_freno
            INNER JOIN traccion t ON v.id_traccion = t.id_traccion
            INNER JOIN tipoPropulsion tp ON v.id_tipoPropulsion = tp.id_tipoPropulsion
            INNER JOIN tipo_transmision tt ON v.id_tipo_transmision = tt.id_tipo_transmision
            LEFT JOIN detalle_reserva dr 
              ON v.id_vehiculo = dr.id_vehiculo AND @fecha BETWEEN dr.fechaInicio AND dr.fechaFin
            LEFT JOIN detalle_renta r 
              ON v.id_vehiculo = r.id_vehiculo AND @fecha BETWEEN r.fechaInicio AND r.fechaFin
            WHERE dr.id_vehiculo IS NULL
              AND r.id_vehiculo IS NULL
              AND ver.id_veersion = @id_version
              AND mo.id_modelo = @id_modelo
              AND m.id_marca = @id_marca
            `
        )
    );

    if (query.recordset.length === 0) {
      return res.status(404).json({
        message:
          "No hay vehículos disponibles para la fecha y los criterios seleccionados.",
      });
    }

    res.json(query.recordset);
  } catch (error) {
    console.error("Error al obtener los vehículos disponibles:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los vehículos disponibles" });
  }
};

vehicle.getDisponibilidad = async (req, res) => {
  try {
    const { id_vehiculo, fechaInicio, fechaFin } = req.params;

    console.log("ID Vehículo:", id_vehiculo);
    console.log("Fecha Inicio:", fechaInicio);
    console.log("Fecha Fin:", fechaFin);

    if (!fechaInicio || !fechaFin || !id_vehiculo) {
      return res
        .status(400)
        .json({ message: "Faltan parámetros necesarios en la solicitud." });
    }

    const query = await sql.connect().then((pool) =>
      pool
        .request()
        .input("id_vehiculo", sql.Int, id_vehiculo)
        .input("fechaInicio", sql.Date, fechaInicio)
        .input("fechaFin", sql.Date, fechaFin)
        .query(
          `
            SELECT 
              dr.fechaInicio AS fechaInicioReserva, 
              dr.fechaFin AS fechaFinReserva,
              'Reservado' AS estado
            FROM detalle_reserva dr
            WHERE dr.id_vehiculo = @id_vehiculo
              AND (
                (@fechaInicio BETWEEN dr.fechaInicio AND dr.fechaFin) OR
                (@fechaFin BETWEEN dr.fechaInicio AND dr.fechaFin) OR
                (dr.fechaInicio BETWEEN @fechaInicio AND @fechaFin)
              )
            UNION ALL
            SELECT 
              r.fechaInicio AS fechaInicioRenta, 
              r.fechaFin AS fechaFinRenta,
              'Rentado' AS estado
            FROM detalle_renta r
            WHERE r.id_vehiculo = @id_vehiculo
              AND (
                (@fechaInicio BETWEEN r.fechaInicio AND r.fechaFin) OR
                (@fechaFin BETWEEN r.fechaInicio AND r.fechaFin) OR
                (r.fechaInicio BETWEEN @fechaInicio AND @fechaFin)
              )
            `
        )
    );

    if (query.recordset.length > 0) {
      res.json({
        disponible: false,
        conflictos: query.recordset,
      });
    } else {
      // Si no hay conflictos, confirmamos que está disponible
      res.json({ disponible: true });
    }
  } catch (error) {
    console.error("Error al verificar la disponibilidad del vehículo:", error);
    res
      .status(500)
      .json({ message: "Error al verificar la disponibilidad del vehículo." });
  }
};

vehicle.getPlotica = async (req, res) => {
  try {
    const { _id } = req.params;

    console.log("ID Vehículo:", _id);

    if (!_id) {
      return res
        .status(400)
        .json({ message: "Faltan parámetros necesarios en la solicitud." });
    }

    const query = await sql.connect().then((pool) =>
      pool
        .request()
        .input("_id", sql.Int, _id)
        .query(
          `
            SELECT 
    dr.fechaInicio AS fechaInicioReserva, 
    dr.fechaFin AS fechaFinReserva,
    'Reservado' AS estado
FROM detalle_reserva dr
WHERE dr.id_vehiculo = @_id
  AND (
        dr.fechaInicio >= GETDATE() OR
        dr.fechaFin >= GETDATE()
      )

UNION ALL

SELECT 
    r.fechaInicio AS fechaInicioRenta, 
    r.fechaFin AS fechaFinRenta,
    'Rentado' AS estado
FROM detalle_renta r
WHERE r.id_vehiculo = @_id
  AND (
        r.fechaInicio >= GETDATE() OR
        r.fechaFin >= GETDATE()
      )
        `
        )
    );

    if (query.recordset.length > 0) {
      res.json(query.recordset);

      // Si hay conflictos, devolvemos el estado y las fechas
      // res.json({
      //   disponible: false,
      //   conflictos: query.recordset,
      // });
    } else {
      // Si no hay conflictos, confirmamos que está disponible
      res.json(query.recordset);
    }
  } catch (error) {
    console.error("Error al verificar la disponibilidad del vehículo:", error);
    res
      .status(500)
      .json({ message: "Error al verificar la disponibilidad del vehículo." });
  }
};

vehicle.getVehicleWithFiles = async (req, res) =>{
  try {
    const { placa, id_tipo_archivo } = req.query;

    try {
      const connection = await sql.connect();
  
      let query = `
        SELECT 
          va.id_vehiculo,
          v.placa,
          ta.nombre AS tipo_archivo,
          va.num_archivo,
          va.nombre_archivo,
          va.ruta_archivo,
          va.fecha_subida
        FROM vehiculos_archivos va
        INNER JOIN vehiculo v ON va.id_vehiculo = v.id_vehiculo
        INNER JOIN tipo_archivo ta ON va.id_tipo_archivo = ta.id_tipo_archivo
        WHERE 1=1
      `;
  
      // Aplicar filtros dinámicamente
      const inputs = [];
      if (placa) {
        query += " AND v.placa = @placa";
        inputs.push({ name: "placa", type: sql.VarChar, value: placa });
      }
      if (id_tipo_archivo) {
        query += " AND va.id_tipo_archivo = @id_tipo_archivo";
        inputs.push({ name: "id_tipo_archivo", type: sql.Int, value: parseInt(id_tipo_archivo) });
      }
  
      const request = connection.request();
      inputs.forEach(({ name, type, value }) => {
        request.input(name, type, value);
      });
  
      const result = await request.query(query);
  
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener archivos de vehículos:", error);
      res.status(500).json({ message: "Error al obtener archivos de vehículos", error });
    }
  } catch (error) {
    console.log("Error Getting data at vehicle", error)
  }
}

module.exports = vehicle;
