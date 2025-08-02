const {sql} = require("../dbConnection")

const myCompany ={}

myCompany.create = async (req, res) =>{

    return res.json({message: "Employe created"})
}

myCompany.update = async (req, res) =>{

}
myCompany.deleteOne = async (req, res) =>{

}
myCompany.getAll = async (req, res) =>{
    try{

        const result = await sql.query(
          `
          select * from miEmpresa where id_estado_a_i = 1;
          `
        )
    
        res.send(result.recordset)
    
      }catch(error){
        console.log("Error Getting Data", error);
        console.status(400).send("Error Getting Data");
      }
}
myCompany.getOne = async (req, res) =>{

}

module.exports = myCompany