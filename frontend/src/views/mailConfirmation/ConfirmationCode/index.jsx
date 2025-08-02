import Icon from "../../../components/Icon";
import Lock from "../../../components/Lock";
import RentEasyButton from "../../../components/Login/RentEasyButton";
import confirmCode from "../confirmCode";
import "./style.css";
import { ErrorMessage, Field, Form, Formik } from "formik";

export default function ConfirmationCode({ newPassword, setnewPassword }) {
  const handleConfirmation = (values) => confirmCode(values.code, setnewPassword);

  return (
    <div className="confirmation-code-container">
      {newPassword && (
        <div
          className="lock-container"
          style={{
            cursor: newPassword ? "not-allowed" : "default",
          }}
        >
          <Lock />
        </div>
      )}
      <Formik
        initialValues={{
          code: "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.code) {
            errors.code = "Debe ingresar el código de confirmación";
          }

          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          handleConfirmation(values);
          //   resetForm();
        }}
      >
        {({ handleChange, handleSubmit }) => (
          <Form className="form-confirmation">
            <div style={{}}>
              {/* <label className="label"></label> */}
              <div className="control">
                <Field
                  disabled={newPassword}
                  className="field-confirmation"
                  type="text"
                  name="code"
                  placeholder="Ingrese el código de confirmación"
                  onChange={handleChange}
                />
                {/* <div className="right-input-icon">
                  <Icon name="lock-line" />
                </div> */}
                <ErrorMessage
                  name="code"
                  component="p"
                  className="help is-danger"
                />
              </div>
            </div>
            <RentEasyButton
              onclick={handleSubmit}
              text="Confirmar"
              type="submit"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
