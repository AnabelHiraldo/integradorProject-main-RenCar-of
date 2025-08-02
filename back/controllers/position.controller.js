const position ={}

position.create = async (req, res) =>{
    try{

        const{
          nombre,
          descripcion,
          salario,
        } = req.body;
    
        const result = await sql.query(
          ` INSERT INTO posicion (nombre, descripcion, salario, id_estado_a_i)
          values
          ('${nombre}','${descripcion}', '${salario}','${1}')
          `)
          res.json({message: "Posicion Registrada"})
      }catch(error){
        console("Error inserting data", error);
        res.status(500).send("Error getting data");
      }
    return res.json({message: "Position created"})
}

position.update = async (req, res) =>{


    return res.json({message: "Position Updated"})
}

position.deleteOne = async (req, res) =>{

    return res.json({message: "Position created"})
}

position.getAll = async (req, res) =>{

    return res.json({message: "Position created"})
}

position.getOne = async (req, res) =>{

    return res.json({message: "Position created"})
}


module.exports = position;