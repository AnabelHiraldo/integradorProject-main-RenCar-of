export const validate = (values) => {
  const errors = {};
  if (!values.matricula) {
    errors.matricula = "La matrícula es obligatoria";
  }
  if (!values.id_modelo) {
    errors.id_modelo = "El ID del modelo es obligatorio";
  }
  if (!values.año) {
    errors.año = "El año es obligatorio";
  }
  if (!values.numPuertas) {
    errors.numPuertas = "El número de puertas es obligatorio";
  }
  if (!values.capacidadPersonas) {
    errors.capacidadPersonas = "La capacidad de personas es obligatoria";
  }
  // if (!values.image) {
  //   errors.image = "La imagen es obligatoria";
  // }
  if (!values.id_color) {
    errors.id_color = "El ID del color es obligatorio";
  }
  if (!values.id_tipo_vehiculo) {
    errors.id_tipo_vehiculo = "Este campo es obligatorio";
  }
  if (!values.id_sistema_freno) {
    errors.id_sistema_freno = "Este campo es obligatorio";
  }
  if (!values.id_traccion) {
    errors.id_traccion = "Este campo es obligatorio";
  }
  if (!values.id_tipo_transmision) {
    errors.id_tipo_transmision = "Este campo es obligatorio";
  }
  if (!values.id_tipoPropulsion) {
    errors.id_tipoPropulsion = "Este campo es obligatorio";
  }
  if (!values.placa) {
    errors.placa = "La placa es obligatoria";
  }
  if (!values.combustible) {
    errors.combustible = "El tipo de combustible es obligatorio";
  }
  if (!values.estado) {
    errors.estado = "El estado es obligatorio";
  }
  return errors;
};