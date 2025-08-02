import { useState } from "react";
import Icon from "../Icon";
import "./style.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import RentEasyButton from "../Login/RentEasyButton";
import registerUser from "./registerUser";

export default function Register({ setSignIn }) {
  const handleRegister = (values) => registerUser(values);
  
  return (
    <div className="login-container">
      <>
        <h2 className="register_title">Registrarse</h2>
        <p className="extra">Por favor completar los datos para continuar</p>
      </>
      <Formik
        initialValues={{
          email: "",
          nombre: "",
          sexo: "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.email) {
            errors.email = "Campo requerido";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Correo electrónico inválido";
          }

          if (!values.nombre) {
            errors.nombre = "Campo requerido";
          }

          if (!values.sexo) {
            errors.sexo = "Campo requerido";
          }

          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          handleRegister(values);
          resetForm();
        }}
      >
        {({ handleChange, setFieldValue, handleSubmit }) => (
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
              <label className="label">Nombre</label>
              <div className="control">
                <Field
                  className="input"
                  type={"text"}
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  onChange={handleChange}
                />
                <div className="left-input-icon">
                  <Icon name="user-line" />
                </div>
                <ErrorMessage
                  name="nombre"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            <div
              className="field"
              style={{
                zIndex: 10,
              }}
            >
              <label className="label">Sexo</label>
              <div className="control">
                <Select
                  options={[
                    { value: 1, label: "Masculino" },
                    { value: 2, label: "Femenino" },
                  ]}
                  placeholder="Sexo"
                  onChange={(selected) => setFieldValue("sexo", selected.value)}
                  //   isSearchable
                />
                <ErrorMessage
                  name="sexo"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            <RentEasyButton
              onclick={handleSubmit}
              text={"Registrarse"}
              type="submit"
            />
            <div className="register_btn">
              ¿Tienes una cuenta?{" "}
              <span onClick={() => setSignIn(true)}>Iniciar sesion</span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
