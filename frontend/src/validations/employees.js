export const employeesValidation = (values) => {
    const errors = {};
  
    
    if (!values.nombre) {
      errors.nombre = 'El campo Nombre es requerido';
    } else if (values.nombre.length < 3) {
      errors.nombre = 'El Nombre debe tener al menos 3 caracteres';
    }
  
    if (!values.apellido) {
      errors.apellido = 'El campo Apellido es requerido';
    } else if (values.apellido.length < 3) {
      errors.apellido = 'El Apellido debe tener al menos 3 caracteres';
    }

    if (!values.FechaNacimiento) {
      errors.FechaNacimiento = 'El campo Fecha de Nacimiento es requerido';
    } else if (isNaN(new Date(values.FechaNacimiento).getTime())) {
      errors.FechaNacimiento = 'La Fecha de Nacimiento es inválida';
    }
  
    if (!values.documentoIDENTIDAD) {
      errors.documentoIDENTIDAD = 'El campo Número de Documento es requerido';
    } else if (values.documentoIDENTIDAD.toString().length < 5) {
      errors.documentoIDENTIDAD = 'El Número de Documento debe tener al menos 5 caracteres';
    }
  
    if (!values.typeDocument) {
      errors.typeDocument = 'El campo Tipo de Documento es requerido';
    }
  
    if (!values.sexo) {
      errors.sexo = 'El campo Sexo es requerido';
    }
  
    if (!values.email) {
      errors.email = 'El campo Email es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'El Email es inválido';
    }
  
    if (!values.FechaIngreso) {
      errors.FechaIngreso = 'El campo Fecha de Ingreso es requerido';
    } else if (isNaN(new Date(values.FechaIngreso).getTime())) {
      errors.FechaIngreso = 'La Fecha de Ingreso es inválida';
    }
  
    if (!values.estado) {
      errors.estado = 'El campo Estado es requerido';
    } else if (!['activo', 'inactivo', 'pendiente'].includes(values.estado.toLowerCase())) {
      errors.estado = 'El Estado debe ser "activo", "inactivo" o "pendiente"';
    }
  
    return errors;
  };
  