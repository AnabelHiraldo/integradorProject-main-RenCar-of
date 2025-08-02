export const sexo = (values) => {
    const errors = {};
  
    if (!values.sexo) {
      errors.sexo = 'El campo Sexo es requerido';
    } else if (!['masculino', 'femenino'].includes(values.sexo.toLowerCase())) {
      errors.sexo = 'Sexo debe ser "masculino", "femenino"';
    }
  
   
    if (!values.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La fecha es inválida';
    }
  
  
    if (!values.estado) {
      errors.estado = 'El estado es requerido';
    }
  
    return errors;
  };
  