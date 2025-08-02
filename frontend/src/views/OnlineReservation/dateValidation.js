import Swal from "sweetalert2";

export default function dateValidation(
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  blockD,
  setdayss
) {
  let days = [];

  if (!startDate || !endDate) return;

  if (endDate < startDate) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "La fecha de fin no puede ser menor a la fecha de inicio",
    });

    setStartDate(null);
    setEndDate(null);
    return localStorage.removeItem("days");
  }

  // if (blockD.length > 0) {
  let dateWithExcluded = [];

  const msPorDia = 24 * 60 * 60 * 1000;

  for (
    let tiempo = startDate.getTime();
    tiempo <= endDate.getTime();
    tiempo += msPorDia
  ) {
    days.push(new Date(tiempo));
  }

  const existDateBusy = blockD.some((bd) => {
    const bdFecha = new Date(bd).toISOString().split("T")[0];
    return days.some((d) => {
      const dFecha = new Date(d).toISOString().split("T")[0];

      return bdFecha === dFecha;
    });
  });

  if (existDateBusy) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Este vehículo no está disponible en las fechas seleccionadas",
    });

    setStartDate(null);
    setEndDate(null);
    return localStorage.removeItem("days");
  }

  // localStorage.setItem("days", JSON.stringify(days.length));
  //setdayss(days);

  days.shift();


  setdayss(days)
  return days;
  //}
}
