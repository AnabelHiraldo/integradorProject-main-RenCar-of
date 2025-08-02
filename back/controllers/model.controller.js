const {sql} = require("../dbConnection")

const model ={}

model.create = async (req, res) => {
    try {
        const { modelo, id_marca, id_categoria, descripcion, id_estado_a_i } = req.body;

        const query = await sql.query(
           `INSERT INTO modelo (modelo, id_marca, id_categoria, descripcion, id_estado_a_i)
         OUTPUT INSERTED.id_modelo AS lastId
         VALUES ('${modelo}', ${id_marca}, ${id_categoria}, '${descripcion}', ${id_estado_a_i})`
        );

        res.json({ message: "Modelo registrado con éxito" });
    } catch (error) {
        console.log("Error inserting Data", error);
        res.status(500).send("Error Inserting Data");
    }
};

model.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        if(id!=null){
            const model = await sql.query( `SELECT * FROM modelo WHERE id_marca = '${id}'`)
            console.log(model)
            res.json(model.recordset);
        }
       
    } catch (error) {
        console.log("error Getting data",error)
    }

};

model.getAll = async (req, res) => {
    const color = await sql.query( "select * from color")
    res.json(color.recordset);
};

module.exports = model;