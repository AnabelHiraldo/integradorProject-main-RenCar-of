const { sql } = require("../dbConnection");

const createClientFast = {};

createClientFast.create = async (req, res) => {
  const { nombre, email, telefono, cedula } = req.body;

  console.log(email)

  const emailget = email
  try {
    const pool = await sql.connect();

    // Validar entrada
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "El campo email es obligatorio y debe ser válido." });
    }

    // Verificar si la entidad ya existe
    const existingEntidad = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT id_entidad FROM entidad WHERE email = @email;
      `);

      let insertedId = 0
        const CreateEntidad = await sql.query(`
            INSERT INTO entidad (nombre, email, id_estado_a_i)
            OUTPUT INSERTED.id_entidad
            VALUES ('${nombre}', '${emailget}', '${1}');
        `);
        console.log("aqui")
        
        if (CreateEntidad.recordset && CreateEntidad.recordset.length > 0) {
            insertedId = CreateEntidad.recordset[0].id_entidad;
            console.log('ID Insertado:', insertedId);
        } else {
            console.log('No se devolvió ningún ID.');
        }
        
 

    const fechaActual = new Date().toISOString().split("T")[0];
    const CreateClient = await pool.request()
      .input("id_entidad", sql.Int, insertedId)
      .input("fechaIngreso", sql.Date, fechaActual)
      .input("id_estado_a_i", sql.Int, 1)
      .query(`
        INSERT INTO cliente (id_entidad, fechaIngreso, id_estado_a_i)
        OUTPUT INSERTED.id_cliente
        VALUES (@id_entidad, @fechaIngreso, @id_estado_a_i);
      `);

    const id_cliente = CreateClient.recordset[0]?.id_cliente;

    if (!id_cliente) {
      return res.status(400).json({ message: "No se pudo crear el cliente." });
    }

    console.log("ID del cliente insertado:", id_cliente);

    res.status(201).json({ id_cliente });
  } catch (error) {
    console.error("Error al crear cliente rápidamente:", error);

    if (error.number === 2627) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    res.status(500).json({ message: "Error interno del servidor.", error });
  }
};

module.exports = createClientFast;
