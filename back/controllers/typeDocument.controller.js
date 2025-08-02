const { sql } = require("../dbConnection")

const typeDocument ={}

typeDocument.create = async (req, res) =>{

    return res.json({message: "typeDocument created"})
}

typeDocument.update = async (req, res) =>{

    return res.json({message: "typeDocument created"})
}

typeDocument.deleteOne = async (req, res) =>{

    return res.json({message: "typeDocument created"})
}

typeDocument.getAll = async (req, res) =>{
    try {
        const query = await sql.query("select * from tipoDocumento");

        return res.json(query.recordset);
      } catch (error) {
        console.error("Error getting data", error);
        res.status(500).send("Error getting data");
      }
}

typeDocument.getOne = async (req, res) =>{

    return res.json({message: "typeDocument created"})
}


module.exports = typeDocument;