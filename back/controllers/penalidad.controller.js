const {sql} = require("../dbConnection")

const penalidad={}

penalidad.getAll = async (req, res) =>{
    try{

        const result = await sql.query(
          `
          select * from penalidad where id_estado_a_i = 1;
          `
        )
    
        res.json(result.recordset)
    
      }catch(error){
        console.log("Error Getting Data", error);
        console.status(400).send("Error Getting Data");
      }
}

module.exports = penalidad;