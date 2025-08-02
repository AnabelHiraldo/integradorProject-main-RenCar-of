export const versionValidation = (values) => {
    const errors = {};
  
    if (!values.version) {
      errors.version = 'El campo Versión es requerido';
    }
  
    if (!values.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La fecha es inválida';
    }
  
    if (values.estado) {
        errors.estado = 'El campo Estado es requerido';
    }
  
    return errors;
  };
  