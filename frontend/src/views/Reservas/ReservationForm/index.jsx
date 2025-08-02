import { Field, FieldArray, Formik, Form } from "formik";
import ReservasActivas from "../../../components/ModificarReserva/ModificarReserva";
import "./style.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ReservationForm({ reservation, setform, client }) {
  const [state, setstate] = useState({
    ...reservation,
    cliente: client,
  });

  useEffect(() => {
    setstate({
        ...reservation,
        cliente: client,
    });
  }, [reservation]);

  const handleSubmit = (values) => {
    Swal.fire({
      title: "¿Estás seguro de guardar los cambios?",
      showCancelButton: true,
      confirmButtonText: `Guardar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado!", "", "success");
        setform("");
      }
    });
  };

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <div className="form-container">
        <h2 className="form-title">Formulario de Reserva</h2>
        <Formik
          initialValues={state}
          enableReinitialize
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, setValues, resetForm }) => {
            useEffect(() => {
              //   setValues(state);
            }, [state]);
            return (
              <Form>
                {/* Datos principales */}
                <div className="form-group">
                  <label>ID Reserva:</label>
                  <Field
                    name="id_reserva"
                    type="number"
                    className="form-input"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Cliente:</label>
                  <Field name="cliente" type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Total:</label>
                  <Field name="total" type="number" className="form-input" />
                </div>

                {/* Detalles del vehículo */}
                <h3 className="section-title">Detalles del Vehículo</h3>
                <div className="form-group">
                  <label>Marca:</label>
                  <Field name="marca" type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Modelo:</label>
                  <Field name="modelo" type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Versión:</label>
                  <Field name="version" type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Color:</label>
                  <Field name="color" type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Año:</label>
                  <Field name="año" type="number" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Fecha Inicio:</label>
                  <Field
                    name="fechaInicio"
                    type="date"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin:</label>
                  <Field name="fechaFin" type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Precio:</label>
                  <Field name="precio" type="number" className="form-input" />
                </div>

                {/* Botón de enviar */}
                <button type="submit" className="btn-submit">
                  Guardar
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
