const { sql } = require("../dbConnection");

const acuerdos = {};

acuerdos.create = async (req, res) => {
    try {
        const { id_propietario, id_acuerdo, fecha_acuerdo, id_tipo_acuerdo, valor_comision_tarifa, plazo_pago, mantenimiento_incluido } = req.body;

        let newIdAcuerdo = id_acuerdo;

        if (!newIdAcuerdo) {
            const result = await sql.query(`
                SELECT ISNULL(MAX(id_acuerdo), 0) + 1 AS nextIdAcuerdo
                FROM acuerdos
                WHERE id_propietario = ${id_propietario}
            `);
            newIdAcuerdo = result.recordset[0].nextIdAcuerdo;
        }

        await sql.query(`
            INSERT INTO acuerdos (id_propietario, id_acuerdo, fecha_acuerdo, id_tipo_acuerdo, valor_comision_tarifa, plazo_pago, mantenimiento_incluido)
            VALUES ('${id_propietario}', '${newIdAcuerdo}', '${fecha_acuerdo}', '${id_tipo_acuerdo}', '${valor_comision_tarifa}', '${plazo_pago}', '${mantenimiento_incluido}')
        `);

        res.json({ message: "Acuerdo registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};


acuerdos.getByPropietario = async (req, res) => {
    try {
        const { id_propietario } = req.params;
        console.log(id_propietario)

        const query = await sql.query(`
           	SELECT 
   a.id_acuerdo,
   a.fecha_acuerdo,
   ta.id_tipo_acuerdo,
   ta.nombre as nombre_tipo_acuerdo,
   a.valor_comision_tarifa,
   a.plazo_pago,
   a.mantenimiento_incluido
FROM 
    acuerdos a
	inner join tipo_acuerdo ta on a.id_tipo_acuerdo = ta.id_tipo_acuerdo
WHERE 
    id_propietario = ${id_propietario}
    AND a.id_estado_a_i = 1;
        `, {
            input: {
                id_propietario: sql.Int,
            },
            values: {
                id_propietario,
            },
        });

        console.log(query.recordset)
        res.json(query.recordset);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Error fetching data");
    }
};

module.exports = acuerdos;
