const company ={}

company.create = async (req, res) =>{
    const fechaActual = new Date().toISOString().split("T")[0];

    try{
      const {
        nombre,
        apellido,
        FechaNacimiento,
        numeroDocumento,
        tipoDocumento,
        email,
        FechaIngreso,
        sexo,
        estado,
      } = req.body;
      console.log(req.body)
  
      const query = await sql.query(
        `INSERT INTO entidad (nombre, email, documentoIdentidad, id_tipo_entidad, id_tipoDocumento, id_estado_a_i, fecha_registro) 
        OUTPUT INSERTED.id_entidad AS lastId
        VALUES ('${nombre}',  '${email}','${numeroDocumento}','${2}', '${tipoDocumento}', '${1}','${fechaActual}')
        `
     );
  
    res.json({message: "Empleado Registrado con exito"})
     }catch(error){
      console.log("Error inserting Data", error);
      console.status(500).send("Error Inserting Data");
     }
    return res.json({message: "company created"})
}

company.update = async (req, res) =>{

}
company.deleteOne = async (req, res) =>{

}
company.getAll = async (req, res) =>{

}
company.getOne = async (req, res) =>{

}

module.exports = company;