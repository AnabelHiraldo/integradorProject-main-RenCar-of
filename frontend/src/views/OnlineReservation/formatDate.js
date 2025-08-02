export default function formatDate (dates) {
    const formatOnlyOne = (date) => {
        const d = new Date(date);
        const year = d.getUTCFullYear();
        const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
        const day = ("0" + d.getUTCDate()).slice(-2);
  
        return `${year}-${month}-${day}`;
      };
  
      if (!dates) return "";
  
      const datesFormated = dates.map((date) => {
        const d = new Date(date);
  
        return Object.entries(date).reduce((acc, [key, value]) => {
          if (key === "fechaInicioReserva") {
            acc.fechaInicioReserva = formatOnlyOne(value);
          }
          if (key === "fechaFinReserva") {
            acc.fechaFinReserva = formatOnlyOne(value);
          }
          return acc;
        }, {});
      });
  
      return datesFormated;
}