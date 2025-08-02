export const brandValidation = (values) => {
    const errors = {};
  
    if (!values.marca) {
      errors.marca = 'El campo Marca es requerido';
    } else if (values.marca.length < 2) {
      errors.marca = 'La Marca debe tener al menos 2 caracteres';
    }
  
    if (!values.descripcion) {
      errors.descripcion = 'El campo Descripción es requerido';
    } 

    if (!values.fecha) {
      errors.fecha = 'La Fecha es requerida';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La Fecha es inválida';
    }
  
    return errors;
  };
  