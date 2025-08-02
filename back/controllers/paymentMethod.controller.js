const {sql} = require("../dbConnection")
const paymentMethod ={}

paymentMethod.create = async (req, res) => {
    try {
        const { nombre, descripcion, fecha, id_estado_a_i } = req.body;

        const query = await sql.query(
            `INSERT INTO metodo_pago (nombre, descripcion, fecha, id_estado_a_i)
         OUTPUT INSERTED.id_metodo_pago AS lastId
         VALUES ('${nombre}', '${descripcion}', '${fecha}', ${id_estado_a_i})`
    );

        res.json({ message: "Método de pago registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

paymentMethod.get = async (req, res) => {

    try {
        const query = await sql.query(
           `select * from metodo_pago`
        );

        res.json(query.recordset);
    } catch (error) {
        console.log("Error getting Data metodo pago", error);
        res.status(500).send("Error getting Data metodo pago");
    }
};

module.exports = paymentMethod;