const role ={}

role.create = async (req, res) => {
    try {
        const { nombre, descripcion, id_estado_a_i }= req.body;

        const query = await sql.query(
           `INSERT INTO rol (nombre, descripcion, id_estado_a_i)
         OUTPUT INSERTED.id_rol AS lastId
         VALUES ('${nombre}', '${descripcion}', ${id_estado_a_i})`
        );

        res.json({ message: " Rol registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

module.exports = role;