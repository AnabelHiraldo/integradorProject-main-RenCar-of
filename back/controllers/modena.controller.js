const {sql} = require("../dbConnection")

const moneda ={}

moneda.get = async (req, res) => {

    try {
        const query = await sql.query(
           `select * from tipoMoneda`
        );

        res.json(query.recordset);
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};
module.exports = moneda