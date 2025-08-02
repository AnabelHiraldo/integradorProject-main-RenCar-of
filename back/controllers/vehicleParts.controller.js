const {sql} = require("../dbConnection")

const vehicleParts = {}


vehicleParts.getAll = async (req, res) =>{
    try {
        const queryResult = await sql.query(
            "Select * from parte_vehiculo"
        )
        res.json(queryResult.recordset)
    } catch (error) {
        console.log("Error getting data", error)
    }
}

module.exports = vehicleParts