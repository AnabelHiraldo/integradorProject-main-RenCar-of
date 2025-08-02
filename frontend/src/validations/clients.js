export const clientsValidation = (values) => {
  const errors = {};

  if (!values.nombre) {
    console.log(values);
    
    errors.nombre = 'Nombre es requerido';
  }

  if (!values.apellido) {
    errors.apellido = 'Apellido es requerido';
  }

  if (!values.fechaNacimiento) {
    errors.fechaNacimiento = 'Fecha de Nacimiento es requerida';
  } else if (isNaN(new Date(values.fechaNacimiento).getTime())) {
    errors.fechaNacimiento = 'Fecha de Nacimiento inválida';
  }

  if (!values.numeroDocumento) {
    errors.numeroDocumento = 'Número de Documento es requerido';
  }

  if (!values.tipoDocumento) {
    errors.tipoDocumento = 'Tipo de Documento es requerido';
  }

  if (!values.email) {
    errors.email = 'Email es requerido';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Email inválido';
  }

  // if (!values.fechaIngreso) {
  //   errors.fechaIngreso = 'Fecha de Ingreso es requerida';
  // } else if (isNaN(new Date(values.fechaIngreso).getTime())) {
  //   errors.fechaIngreso = 'Fecha de Ingreso inválida';
  // }

  // if (!values.estado) {
  //   errors.estado = 'Estado es requerido';
  // }

  if (!values.sexo) {
    errors.sexo = 'seleccione un genero';
  }

  return errors;
};