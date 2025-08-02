const fuel ={}

fuel.create = async (req, res) => {
    try {
        const { nombre, descripcion, id_estado_a_i } = req.body;


        const query = await sql.query(
             `INSERT INTO combustible (nombre, descripcion, id_estado_a_i)
             OUTPUT INSERTED.id_combustible AS lastId
             VALUES ('${nombre}', '${descripcion}', '${id_estado_a_i}')`
        );

        res.json({ message: "Combustible registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

module.exports = fuel;