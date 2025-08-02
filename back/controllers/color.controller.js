const { sql } = require("../dbConnection");

const color = {};
color.create = async (req, res) => {
    const fechaActual = new Date().toISOString().split("T")[0];

    try {
        console.log("req.body create", req.body);
        
        const { color, id_estado_a_i } = req.body;

         const query = await sql.query(
             `INSERT INTO color (color, id_estado_a_i)
              VALUES ('${color}', '${id_estado_a_i}')`
         );

        res.json({ message: "Color registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

color.update = async (req, res) => {
    const fechaActual = new Date().toISOString().split("T")[0];

    try {
        console.log("req.body Update", req.body);
        const {id} = req.params;
        const { color, id_estado_a_i } = req.body;

        console.log(id)

          const query = await sql.query(
             `UPDATE color SET color = '${color}', id_estado_a_i = '${id_estado_a_i}' WHERE id_color = ${id}`

          );

        res.json({ message: "Color Actualizado con éxito" });
    } catch (error) {
        console.log("Error updating Data", error);
        res.status(500).send("Error updating Data");
    }
};


color.getOne = async (req, res) => {
    const { id } = req.params;
    const color = await sql.query( `SELECT * FROM color WHERE id_color = '${id}'`)
    res.json(color.recordset[0]);
};

color.getAll = async (req, res) => {
    const color = await sql.query( "select * from color")
    res.json(color.recordset);
};
module.exports = color;