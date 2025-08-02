const {sql} = require("../dbConnection")
const employee ={}

employee.create = async (req, res) =>{

    const fechaActual = new Date().toISOString().split("T")[0];

    console.log(req.body)
    try{
      const {
        nombre,
        apellido,
        FechaNacimiento,
        documentoIDENTIDAD,
        typeDocument,
        email,
        FechaIngreso,
        sexo,
        estado,
      } = req.body;
    
    
      const result = await sql.query(
        `INSERT INTO entidad (nombre, apellido, fechaNacimiento, email, documentoIdentidad, id_sexo, id_tipo_entidad, id_tipoDocumento, id_estado_a_i, fecha_ingreso) 
         OUTPUT INSERTED.id_entidad AS lastId
         VALUES ('${nombre}', '${apellido}', '${FechaNacimiento}', '${email}','${documentoIDENTIDAD}','${sexo}','${1}', '${typeDocument}', '${1}','${fechaActual}')
         `);

         const lastId = result.recordset[1].lastId;
    console.log("Inserted ID:", lastId);
    
       const empleado = await sql.query(
         `INSERT INTO empleado (id_entidad,fecha_Ingreso, id_estado_a_i) VALUES (${lastId}, '${fechaActual}', '${1}')`
      );
    
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Error inserting data");
    }
    return res.json({message: "Employe created"})
}

employee.update = async (req, res) =>{

}
employee.deleteOne = async (req, res) =>{

}

  // employee.getAll = async (req, res) => {
  //   try {
  //     const query = `
  //       SELECT 
  //         e.id_empleado, 
  //         en.nombre, 
  //         en.apellido 
  //       FROM empleado e
  //       JOIN entidad en ON e.id_entidad = en.id_entidad
  //     `;
  
  //     const result = await sql.query(query);
  //     res.json(result.recordset); 
  //   } catch (error) {
  //     console.error("Error al obtener empleados:", error.message);
  //     res.status(500).json({
  //       message: "Error al obtener empleados",
  //       error: error.message,
  //     });
  //   }
  // };
  employee.getAll = async (req, res) => {
    try {
      const query = `
        SELECT 
    emp.id_empleado,
    emp.fecha_ingreso AS fechaIngresoEmpleado,
    emp.id_estado_a_i AS estadoEmpleado,

    en.nombre,
    en.apellido,
    en.fechaNacimiento,
    en.email,
    en.documentoIdentidad,
    en.id_estado_a_i AS estadoEntidad,

    te.nombre AS nombreTipoEntidad,
    td.documento AS nombreTipoDocumento,
    s.sexo AS sexoNombre,  -- Campo de la tabla sexo


    p.nombre AS nombrePosicion,
    p.salario,

    pemp.id_estado_a_i AS estadoPosicionEmpleado

FROM empleado emp
INNER JOIN entidad en ON emp.id_entidad = en.id_entidad
LEFT JOIN posicionEmpleado pemp ON emp.id_empleado = pemp.id_empleado
LEFT JOIN posicion p ON pemp.id_posicion = p.id_posicion
LEFT JOIN tipo_entidad te ON en.id_tipo_entidad = te.id_tipo_entidad
LEFT JOIN tipoDocumento td ON en.id_tipoDocumento = td.id_tipoDocumento
LEFT JOIN sexo s ON en.id_sexo = s.id_sexo;
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
  

employee.getOne = async (req, res) =>{

}




module.exports = employee;