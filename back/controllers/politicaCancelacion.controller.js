const {sql} = require("../dbConnection")

const politicaCacelacion ={}


politicaCacelacion.getAll = async (req, res) =>{
    try {
        const query = await sql.query
        (
            `Select * from politicas_cancelacion where id_estado_a_i = 1`
        )

        if(query.recordset.length > 0){
            res.json(query.recordset)

        }else{
            res.json({message: "No hay politicas activas"})
            console.log("No hay politicas activas")
        }
    } catch (error) {
        console.log("Error getting data", error)
    }
}

module.exports = politicaCacelacion