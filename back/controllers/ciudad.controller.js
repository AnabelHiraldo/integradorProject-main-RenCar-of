const {sql} = require("../dbConnection")

const ciudad ={}

ciudad.create = async (req, res) => {
    try {
        const { ciudad, id_provincia, id_estado_a_i } = req.body;

        const query = await sql.query(
            `INSERT INTO ciudad (ciudad, id_provincia, id_estado_a_i)
             OUTPUT INSERTED.id_ciudad AS lastId
             VALUES ('${ciudad}', '${id_provincia}', '${id_estado_a_i}')`
        );

        res.json({ message: "Ciudad registrada con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};
ciudad.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const version = await sql.query( `select * from ciudad where id_provincia = '${id}'`)
        console.log(version)
        res.json(version.recordset);
    } catch (error) {
        console.log("error Getting data",error)
    }

};
module.exports = ciudad;