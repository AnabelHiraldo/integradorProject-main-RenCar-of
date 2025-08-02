const {sql} = require("../dbConnection")

const filterVehicle ={}

filterVehicle.create = async (req, res) => {
try {
  console.log("Create")
} catch (error) {
  console.log("error")
}
}

filterVehicle.filter = async (req, res) => {
    try {

        const { id_marca, id_modelo, anio, anio_hasta, precio, precio_hasta, id_traccion, id_color, id_tipo_transmision,fechaInicio,fechaFin } = req.query;
       console.log(req.query)
         const query = await sql.connect().then((pool) =>
             pool
               .request()
               .input("marca", sql.Int, id_marca || null) 
               .input("modelo", sql.Int, id_modelo || null)
               .input("año_min", sql.Int, anio || null)
               .input("año_max", sql.Int, anio_hasta || null)
               .input("precio_min", sql.Decimal(18, 2), precio || null)
               .input("precio_max", sql.Decimal(18, 2), precio_hasta || null)
               .input("traccion", sql.Int, id_traccion || null)
               .input("color", sql.Int, id_color || null)
               .input("transmision", sql.Int, id_tipo_transmision || null)
               .input("fechaInicio", sql.Date, fechaInicio || null)
               .input("fechaFin", sql.Date, fechaFin || null)

               .execute("FiltrarVehiculos") 
           );
        
           if (query.recordset.length === 0) {
             return res.status(404).json({
               message: "No hay vehículos que coincidan con los criterios seleccionados.",
             });
          }
        
           res.json(query.recordset);
        console.log(query.recordset)
    } catch (error) {
        console.log("error Getting data",error)
    }
};

module.exports = filterVehicle;