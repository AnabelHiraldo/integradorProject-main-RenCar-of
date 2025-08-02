const {sql} = require("../dbConnection")

const gravedad = {}


gravedad.getAll = async (req, res) =>{
    try {
        const queryResult = await sql.query(
            "Select * from gravedad"
        )
        console.log(queryResult.recordset)
        res.json(queryResult.recordset)
    } catch (error) {
        console.log("Error getting data", error)
    }
}

module.exports = gravedad