const {sql} = require("../dbConnection")
const category = {}

category.create = async (req, res) => {
    try {
        const { nombre, descripcion, id_estado_a_i } = req.body;

        const query = await sql.query(
            `INSERT INTO categoria (nombre, descripcion, id_estado_a_i)
             OUTPUT INSERTED.id_categoria AS lastId
             VALUES ('${nombre}', '${descripcion}', '${id_estado_a_i}')`
        );

        res.json({ message: "Categoría registrada con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};
category.getAll = async (req, res) => {
    const categoria = await sql.query( "select * from categoria")
    res.json(categoria.recordset);
};

module.exports = category;