const e = require("express");
const { sql } = require("../dbConnection");
const nodemailer = require("nodemailer");

const user = {};
let Gcode = "";
let emailToActivate = "";
let nombreEntidad = "";
let id_userInsert = 0;

user.create = async (req, res) => {
  console.log("create");

  try {
    const { email, username, contraseña, id_estado_a_i } = req.body;

    const passwordToUse = contraseña
      ? contraseña
      : Math.random().toString(36).slice(-8);

    const query = await sql.query(
      `INSERT INTO usuario (email, username, contraseña, id_estado_a_i)
        OUTPUT INSERTED.id_usuario AS lastId
        VALUES ('${email}', '${username}', '${passwordToUse}', ${2})`
    );

    if (query.recordset && query.recordset.length > 0) {
      id_userInsert = query.recordset[0].lastId;
  } else {
      console.log('No se devolvió ningún ID.');
  }

    nombreEntidad = username;
    emailToActivate = email;
    sendConfirmationEmail(email);
    res.json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.log("Error inserting Data", error);
    res.status(500).send("Error Inserting Data");
  }
};

const sendConfirmationEmail = async (email) => {
  const mailCode = Math.random().toString(36).slice(-8);
  Gcode = mailCode;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maxsilmaxsil73@gmail.com",
      pass: "bkib xteg ngri nnxk",
    },
  });

  const mailOptions = {
    from: "maxsilmaxsil73@gmail.com",
    to: email,
    subject: "Codigo de confirmacion",
    html: `
        <h1>Gracias por registrarte en RentACar</h1>
        <p>Para completar tu registro, por favor ingresa el siguiente código:</p>
        <h2>${mailCode}</h2>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error enviando el email:", error);
    } else {
      console.log("Email enviado:", info.response);
    }
  });
};

user.confirmEmail = async (req, res) => {
  try {
    const { code } = req.params;

    if (code === Gcode) {
      const query = await sql.query(
        `UPDATE usuario
        SET id_estado_a_i = 1
        WHERE email = '${emailToActivate}'`
      );

      Gcode = "";
      let insertedId = 0;

      const CreateEntidad = await sql.query(`
        INSERT INTO entidad (nombre, email, id_estado_a_i)
        OUTPUT INSERTED.id_entidad
        VALUES ('${nombreEntidad}', '${emailToActivate}', ${1});
    `);
    
    if (CreateEntidad.recordset && CreateEntidad.recordset.length > 0) {
        insertedId = CreateEntidad.recordset[0].id_entidad;
        console.log('ID Insertado:', insertedId);
    } else {
        console.log('No se devolvió ningún ID.');
    }
    
    const fechaActual = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    
      const CreateClient = await sql.query(
        `INSERT INTO cliente
        (id_entidad, fechaIngreso, id_estado_a_i)
        values ('${insertedId}','${fechaActual}','${1}')
        `
      )

      const assignRole = await sql.query(
        `
        insert into usuario_rol (id_rol, id_usuario, id_estado_a_i)
        values ('${1}','${id_userInsert}','${1}')
        `
      )

      res.json({ message: "Código confirmado con éxito" });
    } else {
      res.json({ message: "Código incorrecto" });
    }
  } catch (error) {
    console.log("Error confirming email", error);
    res.status(500).send("Error confirming email");
  }
};

user.createNewPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    const query = await sql.query(
      `UPDATE usuario
      SET contraseña = '${password}'
      WHERE email = '${emailToActivate}'`
    );

    emailToActivate = "";

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.log("Error updating password", error);
    res.status(500).send("Error updating password");
  }
};

user.getAll = async (req, res) => {
  console.log("getAll");

  try {

    const query = await sql.query(`
      SELECT 
          r.id_rol,
          r.nombre AS rol_nombre,
          r.descripcion AS rol_descripcion,
          u.id_usuario,
          u.email,
          u.username,
          u.contraseña,
          u.fecha_session,
          u.sesion,
          ur.id_estado_a_i AS estado_usuario_rol
      FROM 
          dbo.rol r
      LEFT JOIN 
          dbo.usuario_rol ur ON r.id_rol = ur.id_rol
      LEFT JOIN 
          dbo.usuario u ON ur.id_usuario = u.id_usuario
    `);

    // Verificar si hay datos en la consulta
    if (query.recordset && query.recordset.length > 0) {
      res.status(200).json(query.recordset);
    } else {
      res.status(404).json({ message: "No hay usuarios registrados." });
    }

  } catch (error) {
    console.log("Error al obtener los datos:", error);
    res.status(500).send("Error al obtener los datos");
  }
};
module.exports = user;
