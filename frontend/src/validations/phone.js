export const phoneValidation = (values) => {
    const errors = {};
  
    if (!values.numero) {
      errors.numero = 'El campo Número es requerido';
    } else if (values.numero.toString().length < 10) {
      errors.numero = 'El Número debe tener al menos 10 dígitos';
    }
  
    if (!values.tipotelefono) {
      errors.tipotelefono = 'Debe seleccionar un Tipo de Teléfono';
    }
    if (!values.cliente) {
      errors.cliente = 'Debe seleccionar un Cliente';
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
  