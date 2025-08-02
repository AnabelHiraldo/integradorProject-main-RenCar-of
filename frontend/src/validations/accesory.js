export const accesoryValidation = (values) => {
    const errors = {};
  
    if (!values.nombre) {
      errors.nombre = 'El campo Nombre es requerido';
    } else if (values.nombre.length <= 3) {
      errors.nombre = 'El Nombre debe tener al menos 3 caracteres';
    }
  
    if (!values.descripcion) {
      errors.descripcion = 'El campo Descripción es requerido';
    }
  
    if (!values.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La fecha es inválida';
    }
  
    return errors;
  };
  