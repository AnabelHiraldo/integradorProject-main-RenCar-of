export const companyValidation = (values) => {
  const errors = {};

  if (!values.tipo_entidad) {
    errors.tipo_entidad = "El tipo de entidad es obligatorio";
  }

  if (!values.nombre) {
    errors.nombre = "El nombre es obligatorio";
  }

  if (!values.numeroDocumento) {
    errors.numeroDocumento = "El documento de identidad es obligatorio";
  }

  if (!values.tipoDocumento) {
    errors.tipoDocumento = "El tipo de documento es obligatorio";
  }

  if (!values.email) {
    errors.email = "El email es obligatorio";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Email inválido";
  }
  return errors;
}