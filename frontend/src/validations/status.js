export const statusValidation = (values) => {
    const errors = {};
  
    
    if (!values.estado) {
      errors.estado = 'El campo Estado es requerido';
    } else if (values.estado.length < 3) {
      errors.estado = 'El Estado debe tener al menos 3 caracteres';
    }
  
    if (!values.descripcion) {
      errors.descripcion = 'El campo Descripción es requerido';
    } else if (values.descripcion.length < 10) {
      errors.descripcion = 'La Descripción debe tener al menos 10 caracteres';
    }
  
    if (!values.fecha) {
      errors.fecha = 'El campo Fecha es requerido';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La Fecha es inválida';
    }
  
    return errors;
  };
  