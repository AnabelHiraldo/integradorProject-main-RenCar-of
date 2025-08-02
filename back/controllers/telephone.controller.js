const telephone ={}

telephone.create = async (req, res) => {
    try {
        const { numero, id_tipo_telefono, id_entidad, orden, id_estado_a_i } = req.body;

        const query = await sql.query(
            `INSERT INTO telefono (numero, id_tipo_telefono, id_entidad, orden, id_estado_a_i)
             VALUES ('${numero}', ${id_tipo_telefono}, ${id_entidad}, ${orden}, ${id_estado_a_i})`
        );

        res.json({ message: "Teléfono registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

module.exports = telephone;