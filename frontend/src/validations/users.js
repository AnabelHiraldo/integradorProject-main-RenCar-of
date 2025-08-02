export const userValidation = (values) => {
    const errors = {};
  
    if (!values.email) {
      errors.email = 'El correo electrónico es requerido';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'El correo electrónico es inválido';
    }
  
    if (!values.username) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (values.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
  
    if (!values.contraseña) {
      errors.contraseña = 'La contraseña es requerida';
    } else if (values.contraseña.length < 4) {
      errors.contraseña = 'La contraseña debe tener al menos 4 caracteres';
    }
  
    if (!values.estado) {
      errors.estado = 'El estado es requerido';
    }
  
    if (!values.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La fecha es inválida';
    }
  
    return errors;
  };
  