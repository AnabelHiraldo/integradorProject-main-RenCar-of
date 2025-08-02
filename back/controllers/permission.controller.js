const permission ={}

permission.create = async (req, res) => {
    try {
        const { nombre, descripcion, id_estado_a_i } = req.body;

    const query = await sql.query(
        `INSERT INTO permiso (nombre, descripcion, id_estado_a_i)
         OUTPUT INSERTED.id_permiso AS lastId
         VALUES ('${nombre}', '${descripcion}', ${id_estado_a_i})`
    );

        res.json({ message: "Permiso registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

module.exports = permission;