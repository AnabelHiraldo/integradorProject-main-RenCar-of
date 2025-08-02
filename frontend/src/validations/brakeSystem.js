export const brakeSystemValidation = (values) => {
    const errors = {};
  

    if (!values.tipotelefono) {
      errors.tipotelefono = 'El campo Tipo es requerido';
    } else if (values.tipotelefono.length < 3) {
      errors.tipotelefono = 'El Tipo debe tener al menos 3 caracteres';
    }
    if (!values.descripcion) {
      errors.descripcion = 'El campo Descripción es requerido';
    } else if (values.descripcion.length < 10) {
      errors.descripcion = 'La Descripción debe tener al menos 10 caracteres';
    }
    if (!values.estado) {
      errors.estado = 'El campo Estado es requerido';
    } else if (!['activo', 'inactivo', 'pendiente'].includes(values.estado.toLowerCase())) {
      errors.estado = 'El Estado debe ser "activo", "inactivo" o "pendiente"';
    }

    if (!values.fecha) {
      errors.fecha = 'El campo Fecha es requerido';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La Fecha es inválida';
    }
  
    return errors;
  };
  