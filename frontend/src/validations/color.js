export const colorValidation = (values) => {
    const errors = {};
  

    if (!values.color) {
      errors.color = "El campo Color es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(values.color)) {
      errors.color = "El Color solo debe contener letras ";
    } else if (values.color.length < 3) {
      errors.color = "El Color debe tener al menos 3 caracteres";
    }
  
    if (!values.estado) {
      errors.estado = "El campo Estado es obligatorio";
    }
  
    if (!values.searchColor) {
      errors.searchColor = "Debe ingresar un color para buscar";
    }
  
    return errors;
  };
  