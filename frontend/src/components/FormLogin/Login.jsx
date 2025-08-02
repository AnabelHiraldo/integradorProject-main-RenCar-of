import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.css";

export default function LoginForm() {
  const handleSubmit = (values) => {
    console.log("Valores enviados:", values);

    // Petición al servidor para manejar el login
    axios
      .post("http://localhost:3000/api/Login", values) // Cambia la URL al endpoint de tu backend
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "¡Bienvenido!",
        });

        // Maneja el token o datos de la respuesta según tu backend
        console.log("Token recibido:", response.data.token);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Credenciales incorrectas o problema en el servidor",
        });
        console.error("Error en el login:", error);
      });
  };

  return (
    <Formik
      initialValues={{
        email: "", // Campo para el correo electrónico
        password: "", // Campo para la contraseña
      }}
      validate={(values) => {
        const errors = {};

        // Validación del correo electrónico
        if (!values.email) {
          errors.email = "El correo es obligatorio";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "El correo no es válido";
        }

        // Validación de la contraseña
        if (!values.password) {
          errors.password = "La contraseña es obligatoria";
        } else if (values.password.length < 6) {
          errors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        return errors;
      }}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        resetForm(); // Limpia los campos después de enviar
      }}
    >
      {({ handleChange }) => (
        <Form className="login-form">
          <h2>Iniciar Sesión</h2>

          {/* Campo de correo electrónico */}
          <div className="field">
            <label className="label">Correo Electrónico</label>
            <div className="control">
              <Field
                className="input"
                type="text"
                name="email"
                placeholder="Ingrese su correo electrónico"
                onChange={handleChange}
              />
              <ErrorMessage
                name="email"
                component="p"
                className="help is-danger"
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className="field">
            <label className="label">Contraseña</label>
            <div className="control">
              <Field
                className="input"
                type="password"
                name="password"
                placeholder="Ingrese su contraseña"
                onChange={handleChange}
              />
              <ErrorMessage
                name="password"
                component="p"
                className="help is-danger"
              />
            </div>
          </div>

          {/* Botón de inicio de sesión */}
          <button type="submit" className="button-is-primary">
            Ingresar
          </button>
        </Form>
      )}
    </Formik>
  );
}
