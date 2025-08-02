const validateConditionForm = (values) => {
    const errors = {};
  
    if (!values.nombre) {
      errors.nombre = "El campo Nombre es obligatorio.";
    } else if (values.nombre.length < 3) {
      errors.nombre = "El Nombre debe tener al menos 3 caracteres.";
    }
  
    if (!values.descripcion) {
      errors.descripcion = "El campo Descripción es obligatorio.";
    }
  
    if (!values.fecha) {
      errors.fecha = "El campo Fecha es obligatorio.";
    } else if (isNaN(Date.parse(values.fecha))) {
      errors.fecha = "El campo Fecha no es válido.";
    }
  
    if (!values.estado) {
      errors.estado = "Debe seleccionar un estado.";
    }
  
    return errors;
  };
  