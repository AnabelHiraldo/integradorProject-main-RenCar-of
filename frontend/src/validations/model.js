export const modelValidation = (values) => {
    const errors = {};
  
    if (!values.modelo) {
      errors.modelo = 'El campo Modelo es requerido';
    } else if (values.modelo.length < 3) {
      errors.modelo = 'El Modelo debe tener al menos 3 caracteres';
    }
  
    if (!values.marca) {
      errors.marca = 'El campo Marca es requerido';
    }
  
    if (!values.categoria) {
      errors.categoria = 'El campo Categoría es requerido';
    }
  
    if (!values.descripcion) {
      errors.descripcion = 'El campo Descripción es requerido';
    }
  
    if (!values.fecha) {
      errors.fecha = 'El campo Fecha es requerido';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La Fecha es inválida';
    }
  
    return errors;
  };
  