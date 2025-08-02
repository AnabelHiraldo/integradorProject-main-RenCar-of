const {sql} = require("../dbConnection")

const version ={}

version.create = async (req, res) => {
    try {
        const { veersion, descripcion, fecha, id_modelo, id_estado_a_i } = req.body;

        const query = await sql.query(
          `INSERT INTO veersion (veersion, descripcion, fecha, id_modelo, id_estado_a_i)
         OUTPUT INSERTED.id_veersion AS lastId
         VALUES ('${veersion}', ${descripcion}, ${fecha}, '${id_modelo}', ${id_estado_a_i})`
        );

        res.json({ message: "Version registrada con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

version.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const version = await sql.query( `SELECT * FROM veersion WHERE id_modelo = '${id}'`)
        console.log(version)
        res.json(version.recordset);
    } catch (error) {
        console.log("error Getting data",error)
    }

};

module.exports = version;