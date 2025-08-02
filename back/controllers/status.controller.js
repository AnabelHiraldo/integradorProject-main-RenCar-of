const { sql } = require("../dbConnection");
const status ={}

status.create = async (req, res) => {
    try {
        const { estado, descripcion } = req.body;

        const query = await sql.query(
            `INSERT INTO estado_activo_inactivo (estado, descripcion)
             OUTPUT INSERTED.id_estado_a_i AS lastId
             VALUES ('${estado}', '${descripcion}')`
        );

        res.json({ message: "Estado registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

status.getAll = async (req,res) =>{
    try{

        const query = await sql.query("select * from estado_activo_inactivo");

        res.json(query.recordset)
    }catch(error){
        console.log("Error Getting Data",error);
        console.status(400).send("Error Getting Data");
    }
}
module.exports = status;