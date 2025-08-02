const { json } = require("express");
const { sql } = require("../dbConnection");

const inspeccionRecepcion = {};
inspeccionRecepcion.create = async (req, res) => {
    const transaction = new sql.Transaction();
    try {
      await transaction.begin();
  
      const {
        id_renta,
        id_vehiculo,
        id_cliente,
        id_entrega_recepcion_inspeccion,
        detalles = [],
        damages = [],
        subTotal,
        total,
        Observaciones,
        selectedAccessories,
      } = req.body;
  
      const parsedAccessories = JSON.parse(selectedAccessories || "[]");
      const files = req.files.images || [];
  
      console.log("Datos recibidos:", { ...req.body, files });
  
      // Actualizar la tabla `entrega_recepcion_inspeccion`
      await transaction
        .request()
        .input("id_entrega_recepcion_inspeccion", sql.Int, id_entrega_recepcion_inspeccion)
        .input("id_condicion", sql.Int, 11)
        .query(`
          UPDATE entrega_recepcion_inspeccion
          SET id_condicion = @id_condicion
          WHERE id_entrega_recepcion_inspeccion = @id_entrega_recepcion_inspeccion;
        `);
  
      // Insertar datos en `inspeccion_entrega_recepcion`
      for (const accesory of parsedAccessories) {
        await transaction
          .request()
          .input("id_entrega_recepcion_inspeccion", sql.Int, id_entrega_recepcion_inspeccion)
          .input("id_vehiculo", sql.Int, id_vehiculo)
          .input("id_tipo_inspeccion", sql.Int, 2)
          .input("id_equipo_entregado", sql.Int, accesory)
          .input("observacion", sql.Text, Observaciones || null)
          .input("id_estado_a_i", sql.Int, 1)
          .query(`
            INSERT INTO inspeccion_entrega_recepcion (
              id_entrega_recepcion_inspeccion, id_vehiculo, id_tipo_inspeccion,
              id_equipo_entregado, observacion, id_estado_a_i
            ) VALUES (
              @id_entrega_recepcion_inspeccion, @id_vehiculo, @id_tipo_inspeccion,
              @id_equipo_entregado, @observacion, @id_estado_a_i
            );
          `);
      }
  
      // Asignar rutas de imágenes a los daños
      damages.forEach((damage, index) => {
        if (files[index]) {
          damage.ruta_imagen = files[index].filename;
        } else {
          damage.ruta_imagen = null;
        }
      });
  
      // Insertar daños con imágenes en la base de datos
      for (const detail of damages) {
        const {
          id_tipo_daño,
          id_vehiculo,
          id_graveda,
          observaciones,
          id_parte_vehiculo,
          ruta_imagen,
        } = detail;
  
        // Construir la URL completa de la imagen
        const fullImagePath = ruta_imagen
          ? `imageDañosVehicle/${ruta_imagen}`
          : null;
  
        try {
          await transaction
            .request()
            .input("id_entrega_recepcion_inspeccion", sql.Int, id_entrega_recepcion_inspeccion)
            .input("id_tipo_daño", sql.Int, id_tipo_daño)
            .input("id_vehiculo", sql.Int, id_vehiculo)
            .input("id_graveda", sql.Int, id_graveda || null)
            .input("observacion", sql.Text, observaciones || null)
            .input("id_parte_vehiculo", sql.Int, id_parte_vehiculo || null)
            .input("ruta_imagen", sql.VarChar(150), fullImagePath || null)
            .input("id_estado_a_i", sql.Int, 1)
            .query(`
              INSERT INTO dbo.daños_ocacionados (
                id_entrega_recepcion_inspeccion, 
                id_tipo_daño, 
                id_vehiculo, 
                id_graveda, 
                observacion, 
                id_parte_vehiculo, 
                ruta_imagen, 
                id_estado_a_i
              ) 
              VALUES (
                @id_entrega_recepcion_inspeccion, 
                @id_tipo_daño, 
                @id_vehiculo, 
                @id_graveda, 
                @observacion, 
                @id_parte_vehiculo, 
                @ruta_imagen, 
                @id_estado_a_i
              );
            `);
        } catch (error) {
          console.error("Error insertando daños:", error);
          throw new Error("Falló al insertar en daños_ocasionados.");
        }
      }
  
      await transaction.commit();
      res.json({ message: "Inspección registrada con éxito" });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error en la transacción:", error);
      res.status(500).json({ message: "Error al procesar la transacción" });
    }
  };
  


inspeccionRecepcion.getAllColumn = async (req, res) => {
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

inspeccionRecepcion.getEntregaByRent = async (req, res) =>{
    try {
        console.log(req.query)
        const {id_renta} = req.query

        const queryResult = await sql.query(

            `select er.id_entrega_recepcion_inspeccion
from entrega_recepcion_inspeccion er
inner join renta r on er.id_renta = r.id_renta
where r.id_renta = ${id_renta}`
        )
        res.json(queryResult.recordset[0])
        console.log(queryResult.recordset[0])
    } catch (error) {
        console.log("Error getting data",error)
    }
}


inspeccionRecepcion.getEntregaDireccion = async (req, res) =>{
  console.log("Create")
  try {
//     const {id} = req.query
//     console.log(id)
//     const queryResult = await sql.query(`
// SELECT 
//     er.entrega_recepcion_inspeccion,
//     er.id_renta,
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
// FROM entrega_recepcion er
// left JOIN detalle_entrega de ON er.entrega_recepcion_inspeccion = de.entrega_recepcion_inspeccion
// LEFT JOIN lugares_comunes lc on de.id_lugar_comun_entrega = lc.id_lugar
// LEFT JOIN lugares_comunes lcr on de.id_lugar_comun_recogida = lcr.id_lugar

// WHERE er.id_renta = 26
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
  module.exports = inspeccionRecepcion;