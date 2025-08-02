export const provinceValidation = (values) => {
    const errors = {};
  

    if (!values.pais) {
      errors.pais = 'Debe seleccionar un País';
    }
  
    if (!values.provincia) {
      errors.provincia = 'El campo Provincia es requerido';
    } else if (values.provincia.length < 3) {
      errors.provincia = 'El nombre de la Provincia debe tener al menos 3 caracteres';
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
  