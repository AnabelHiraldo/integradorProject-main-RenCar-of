const calcularPenalidad = (fecha, politicas) => {
    const fechaa = new Date(); 
    const fechaFormateada = new Date(fechaa.getFullYear(), fechaa.getMonth(), fechaa.getDate());
    
    // console.log("Fecha local formateada:", fechaFormateada);
    
    // console.log("Fecha actual:", fechaFormateada);
    // console.log("Fecha recibida:", fecha);
    
    const fechaInicio = new Date(fecha);
  
    const Diferencia = fechaInicio - fechaFormateada;
  
    const DiferenciaDias = Math.ceil(Diferencia / (1000 * 60 * 60 * 24));

   
politicas.sort((a, b) => a.dias_antes - b.dias_antes);

let resultado = null; 

console.log(politicas)

for (let i = 0; i < politicas.length; i++) {
    if (DiferenciaDias <= politicas[i].dias_antes) {
        resultado = politicas[i];
        break; 
    }
}

if (resultado) {
    return resultado.penalidad_porcentaje
} else {
    return 0.00
}
      
    // console.log("Diferencia en días:", DiferenciaDias);
  
  };
  

export default calcularPenalidad;
