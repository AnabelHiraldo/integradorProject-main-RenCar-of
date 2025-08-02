import { useState } from "react";
import RentEasySaveButton from "../../../components/RentEasySaveButton";
import "./style.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Icon from "../../../components/Icon";
import setNewPassword from "../newPassword";

export default function CreateNewPassword() {
  const [passwordVibility, setpasswordVibility] = useState(false);
  const [confirmPasswordVibility, setconfirmPasswordVibility] = useState(false);

  const handleNewPasss = (values) => setNewPassword(values.password);

  return (
    <div className="create-new-password-container">
      <div
        style={{
          marginBottom: "10px",
        }}
      >
        Digite su nueva contraseña:
      </div>

      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.password) {
            errors.password = "Debe ingresar una contraseña";
          }

          if (!values.confirmPassword) {
            errors.confirmPassword = "Debe confirmar la contraseña";
          }

          if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
          }

          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          handleNewPasss(values);
          //   resetForm();
        }}
      >
        {({ handleChange, handleSubmit }) => (
          <Form className="form-confirmation">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* <label className="label"></label> */}
              <div style={{
                position: "relative",
              }}>
                <Field
                  className="field-new-password"
                  type={passwordVibility ? "text" : "password"}
                  name="password"
                  placeholder="Ingrese el código de confirmación"
                  onChange={handleChange}
                />
                <div className="right-input-icon">
                  <Icon
                    name={passwordVibility ? "eye-off-line" : "eye-line"}
                    onclick={() => setpasswordVibility(!passwordVibility)}
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="help is-danger"
                />
              </div>
              <div style={{
                position: "relative",
              }}>
                <Field
                  className="field-new-password"
                  type={confirmPasswordVibility ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Ingrese el código de confirmación"
                  onChange={handleChange}
                />
                <div className="right-input-icon">
                  <Icon
                    name={confirmPasswordVibility ? "eye-off-line" : "eye-line"}
                    onclick={() =>
                      setconfirmPasswordVibility(!confirmPasswordVibility)
                    }
                  />
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            <RentEasySaveButton
              text="Guardar"
              onClick={handleSubmit}
              type="submit"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
