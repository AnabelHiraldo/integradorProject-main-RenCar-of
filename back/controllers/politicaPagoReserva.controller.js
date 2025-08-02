const {sql} = require("../dbConnection")

const politicPayReserva ={}



politicPayReserva.create = async (req, res) => {
    try {
      console.log("req.body create", req.body);
  
      const { porcentajeAPagar, fecha, id_estado_a_i } = req.body;
  
      const pool = await sql.connect();
  
      const deactivateQuery = `
        UPDATE politica_pago_reserva
        SET id_estado_a_i = 2
        WHERE id_politica_pago_reserva = (
          SELECT TOP 1 id_politica_pago_reserva
          FROM politica_pago_reserva
          WHERE id_estado_a_i = 1
          ORDER BY id_politica_pago_reserva DESC
        )
      `;
      await pool.request().query(deactivateQuery);
  
      const insertQuery = `
        INSERT INTO politica_pago_reserva (porcentajeAPagar, fecha, id_estado_a_i)
        OUTPUT INSERTED.id_politica_pago_reserva AS lastId
        VALUES (@porcentajeAPagar, @fecha, @id_estado_a_i)
      `;
  
      const result = await pool.request()
        .input("porcentajeAPagar", sql.Decimal(5, 2), porcentajeAPagar)
        .input("fecha", sql.DateTime, fecha)
        .input("id_estado_a_i", sql.Int, id_estado_a_i)
        .query(insertQuery);
  
      const lastId = result.recordset[0].lastId;
  
      res.json({ message: "Política de pago registrada con éxito", lastId });
    } catch (error) {
      console.log("Error inserting Data", error);
      res.status(500).send("Error Inserting Data");
    }
  };

politicPayReserva.getAll = async (req, res) =>{
    try {
        const query = await sql.query
        (
            `Select * from politica_pago_reserva where id_estado_a_i = 1`
        )

        if(query.recordset.length > 0){
            res.json(query.recordset)

        }else{
            res.json({message: "No hay politicas activas"})
            console.log("No hay politicas activas")
        }
    } catch (error) {
        console.log("Error getting data", error)
    }
}

module.exports = politicPayReserva