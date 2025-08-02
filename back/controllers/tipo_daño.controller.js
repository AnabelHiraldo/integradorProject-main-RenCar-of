const {sql} = require("../dbConnection")

const tipoDaño = {}


tipoDaño.getAll = async (req, res) =>{
    console.log("Create")
    try {
        const queryResult = await sql.query(
            "Select * from tipo_daño"
        )
        console.log(queryResult.recordset)
        res.json(queryResult.recordset)
    } catch (error) {
        console.log("Error getting data", error)
    }
}

module.exports = tipoDaño