export const cityValidation = (values) => {
    const errors = {};
  
   
    if (!values.modelo) {
      errors.modelo = 'Debe seleccionar una Provincia';
    }

    if (!values.ciudad) {
      errors.ciudad = 'El campo Ciudad es requerido';
    } else if (values.ciudad.length < 3) {
      errors.ciudad = 'El nombre de la Ciudad debe tener al menos 3 caracteres';
    }

    if (!values.fecha) {
      errors.fecha = 'El campo Fecha es requerido';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La Fecha es inválida';
    }
  
    if (!values.estado) {
      errors.estado = 'Debe seleccionar un Estado';
    } else if (!['activo', 'inactivo', 'pendiente'].includes(values.estado.toLowerCase())) {
      errors.estado = 'El Estado debe ser "activo", "inactivo" o "pendiente"';
    }
  
    return errors;
  };
  