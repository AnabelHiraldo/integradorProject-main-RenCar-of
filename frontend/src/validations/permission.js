export const permissionValidation = (values) => {
    const errors = {};
  
    if (!values.nombre) {
      errors.nombre = "El campo Nombre es requerido.";
    } else if (values.nombre.length < 3) {
      errors.nombre = "El Nombre debe tener al menos 3 caracteres.";
    }
  
    if (!values.descripcion) {
      errors.descripcion = "El campo Descripción es requerido.";
    } else if (values.descripcion.length < 5) {
      errors.descripcion = "La Descripción debe tener al menos 5 caracteres.";
    }
  
    if (!values.estado) {
      errors.estado = "Debe seleccionar un Estado.";
    } else if (!['activo', 'inactivo'].includes(values.estado.toLowerCase())) {
      errors.estado = "El Estado debe ser 'activo' o 'inactivo'.";
    }
  
    if (!values.fecha) {
      errors.fecha = "El campo Fecha es requerido.";
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = "La Fecha no es válida.";
    }
  
    return errors;
  };
  