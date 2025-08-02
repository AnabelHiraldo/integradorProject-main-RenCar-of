const { sql } = require("../dbConnection");
const jwt = require("jsonwebtoken");

const Login = {};

Login.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "El correo y la contraseña son obligatorios",
      });
    }

    const result = await sql.query(`
      SELECT u.id_usuario, u.username, u.email, u.contraseña, r.id_rol, e.nombre
       FROM usuario u
       JOIN usuario_rol ru ON u.id_usuario = ru.id_usuario
       JOIN rol r ON ru.id_rol = r.id_rol
     join entidad e on e.email = u.email
       WHERE u.email = '${email}'
     `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const user = result.recordset[0];

    if (password !== user.contraseña) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      { id_usuario: user.id_usuario, email: user.email, id_rol: user.id_rol },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: user,
      id_rol: user.id_rol,
    });
  } catch (error) {
    console.error("Error en el login:", error.message);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = Login;
