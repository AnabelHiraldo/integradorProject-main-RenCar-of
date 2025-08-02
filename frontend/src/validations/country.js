export const countryValidation = (values) => {
    const errors = {};
  
    
    if (!values.pais) {
      errors.pais = 'El campo País es requerido';
    } else if (values.pais.length < 3) {
      errors.pais = 'El nombre del País debe tener al menos 3 caracteres';
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
  