export const reservationValidation = (values) => {
    const errors = {};
  
   
    if (!values.cliente) {
      errors.cliente = "El campo Cliente es obligatorio";
    } else if (values.cliente.length < 3) {
      errors.cliente = "El Cliente debe tener al menos 3 caracteres";
    }
    if (!values.montototal) {
      errors.montototal = "El campo Monto Total es obligatorio";
    } else if (values.montototal <= 0) {
      errors.montototal = "El Monto Total debe ser mayor a 0";
    }
  
    if (!values.FechaReserva) {
      errors.FechaReserva = "La Fecha de Reserva es obligatoria";
    } else if (isNaN(new Date(values.FechaReserva).getTime())) {
      errors.FechaReserva = "La Fecha de Reserva es inválida";
    } else if (new Date(values.FechaReserva) < new Date()) {
      errors.FechaReserva = "La Fecha de Reserva no puede ser anterior a hoy";
    }

    if (!values.MontoReserva) {
      errors.MontoReserva = "El campo Monto de la Reserva es obligatorio";
    } else if (values.MontoReserva <= 0) {
      errors.MontoReserva = "El Monto de la Reserva debe ser mayor a 0";
    }
  
    if (!values.MetodoPago) {
      errors.MetodoPago = "El campo Método de Pago es obligatorio";
    }
  
    if (!values.empleado) {
      errors.empleado = "Debe seleccionar un Empleado Responsable";
    }
  
    if (!values.estado) {
      errors.estado = "Debe seleccionar un Estado";
    }
  
    return errors;
  };
  