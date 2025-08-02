import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "../Icon";
import RentEasyButton from "./RentEasyButton";
import { useAuth } from "../../contexts/AuthContex";

export default function LoginForm({setSignIn}) {
  const { login } = useAuth();

  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("");
  const [passwordVisibility, setpasswordVisibility] = useState(false);

  const handleSubmit = (values) => {
    axios
      .post("http://localhost:3000/api/Login", values)
      .then((response) => {

        const { token, id_rol, user } = response.data;
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "¡Bienvenido!",
        });
        // Llama al login del contexto
        login(token, id_rol, user);

        // Redirige al usuario según su rol
        if (id_rol === 2 || id_rol === 3) {
          navigate("/admin");
        } else if (id_rol === 1) {
          // localStorage.setItem("token", token);
          // navigate("/client");
        }
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
    <div className="login-container">
      <>
        <h2 className="login_title">Iniciar Sesión</h2>
        <p className="extra">Por favor iniciar sesion para continuar</p>
      </>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "El correo es obligatorio";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "El correo no es válido";
          }

          if (!values.password) {
            errors.password = "La contraseña es obligatoria";
          } 

          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
        }}
      >
        {({ handleChange }) => (
          <Form>
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
                <div className="left-input-icon">
                  <Icon name="mail-line" />
                </div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Contraseña</label>
              <div className="control">
                <Field
                  className="input"
                  type={passwordVisibility ? "text" : "password"}
                  name="password"
                  placeholder="Ingrese su contraseña"
                  onChange={handleChange}
                />
                <div className="left-input-icon">
                  <Icon name="lock-line" />
                </div>
                <div className="right-input-icon">
                  {
                    <Icon
                      name={passwordVisibility ? "eye-off-line" : "eye-line"}
                      onclick={() => {
                        setpasswordVisibility(!passwordVisibility);
                      }}
                    />
                  }
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            <RentEasyButton onclick={() => {}} text='Iniciar sesion' type='submit'/>
            <div className="register_btn">¿No tienes una cuenta? <span onClick={() => setSignIn(false)}>Regístrate</span></div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
