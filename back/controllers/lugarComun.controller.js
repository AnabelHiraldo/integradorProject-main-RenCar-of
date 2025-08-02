const { sql } = require("../dbConnection");

const lugarComun = {};

lugarComun.getAll = async (req, res) => {
  try {
    const queryresult = await sql.query(
      `
          select
lc.id_lugar,
lc.nombre,
lc.calle,
c.id_ciudad,
c.ciudad as ciudad
from lugares_comunes lc
inner join ciudad c on c.id_ciudad = lc.id_ciudad

where lc.id_estado_a_i = 1
`);

  res.json(queryresult.recordset);

  } catch (error) {
    console.log("Error Getting Data", error);
  }
};

module.exports = lugarComun;
