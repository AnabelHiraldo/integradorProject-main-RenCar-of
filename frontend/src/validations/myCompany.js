export const myCompanyValidation = (values) => {
    const errors = {};
  
 
    if (!values.tipo_entidad) {
      errors.tipo_entidad = 'El tipo de entidad es requerido';
    }
  
    if (!values.searchClient) {
      errors.searchClient = 'Debe ingresar los datos para buscar el cliente';
    }

    if (!values.filtroSearch) {
      errors.filtroSearch = 'Debe seleccionar un filtro de búsqueda';
    }
  
    if (!values.nombre) {
      errors.nombre = 'El campo Nombre es requerido';
    }
  
    if (!values.eslogan) {
      errors.eslogan = 'El campo Eslogan es requerido';
    }

    if (!values.Logo) {
      errors.Logo = 'El Logo es requerido';
    }

    if (!values.estado) {
      errors.estado = 'El campo Estado es requerido';
    } else if (!['activo', 'inactivo', 'pendiente'].includes(values.estado.toLowerCase())) {
      errors.estado = 'El estado debe ser "activo", "inactivo" o "pendiente"';
    }
  
    if (!values.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else if (isNaN(new Date(values.fecha).getTime())) {
      errors.fecha = 'La fecha es inválida';
    }
  
    if (!values.mision) {
      errors.mision = 'El campo Misión es requerido';
    }
    if (!values.vision) {
      errors.vision = 'El campo Visión es requerido';
    }
    if (!values.valores) {
      errors.valores = 'El campo Valores es requerido';
    }

    if (!values.instagram) {
      errors.instagram = 'El campo Instagram es requerido';
    }
    if (!values.facebook) {
      errors.facebook = 'El campo Facebook es requerido';
    }
    if (!values.whatsapp) {
      errors.whatsapp = 'El campo Whatsapp es requerido';
    } else if (values.whatsapp.toString().length < 10) {
      errors.whatsapp = 'El número de Whatsapp debe tener al menos 10 dígitos';
    }
    if (!values.x) {
      errors.x = 'El campo X es requerido';
    }
  
    if (!values.numOficina) {
      errors.numOficina = 'El Número de la oficina es requerido';
    } else if (values.numOficina.toString().length < 3) {
      errors.numOficina = 'El Número de la oficina debe tener al menos 3 dígitos';
    }
    if (!values.horario) {
      errors.horario = 'El campo Horario es requerido';
    }
    if (!values.email) {
      errors.email = 'El Email es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'El Email es inválido';
    }

    if (!values.nota) {
      errors.nota = 'El campo Nota es requerido';
    }
  
    return errors;
  };
  