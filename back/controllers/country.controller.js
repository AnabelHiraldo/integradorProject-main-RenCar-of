const country ={}

country.create = async (req, res) => {
    try {
        const { pais, fecha, id_estado_a_i } = req.body;

        const query = await sql.query(
            `INSERT INTO pais (pais, fecha, id_estado_a_i)
              OUTPUT INSERTED.id_pais AS lastId
             VALUES ('${pais}', '${fecha}','${id_estado_a_i}')`
        );

        res.json({ message: "Pais registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

module.exports = country;