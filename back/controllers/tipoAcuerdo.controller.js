const {sql} = require("../dbConnection")

const tipoAcuerdo = {}


tipoAcuerdo.getAll = async (req, res) =>{
    console.log("Create")
    try {
        const queryResult = await sql.query(
            "Select * from tipo_acuerdo"
        )
        res.json(queryResult.recordset)
    } catch (error) {
        console.log("Error getting data", error)
    }
}

module.exports = tipoAcuerdo