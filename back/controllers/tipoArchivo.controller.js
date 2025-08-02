const {sql} = require("../dbConnection")

const tipoArchivo = {}


tipoArchivo.getAll = async (req, res) =>{
    try {
        const queryResult = await sql.query(
            "Select * from tipo_archivo"
        )
        res.json(queryResult.recordset)
    } catch (error) {
        console.log("Error getting data", error)
    }
}

module.exports = tipoArchivo