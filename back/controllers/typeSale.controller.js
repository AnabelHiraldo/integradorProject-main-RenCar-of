const typeSale ={}

typeSale.create = async (req, res) => {
    try {
        const { nombre, descripcion, fecha, id_estado_a_i } = req.body;
        const query = await sql.query(
            `INSERT INTO tipo_venta (nombre, descripcion, fecha, id_estado_a_i)
         OUTPUT INSERTED.id_tipo_venta AS lastId
         VALUES ('${nombre}', '${descripcion}', '${fecha}', ${id_estado_a_i})`
        );

        res.json({ message: "Tipo de venta registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

module.exports = typeSale;