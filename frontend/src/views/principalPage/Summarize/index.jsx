import "./style.css";

export default function Summarize() {
  const texto =
    `Bienvenido a RentEasy, tu socio confiable para alquilar vehículos con comodidad y seguridad.
             En nuestra empresa, nos dedicamos a ofrecerte una experiencia de alquiler de autos sin igual, con una amplia flota de vehículos modernos y bien mantenidos para satisfacer todas tus 
            necesidades de transporte. Ya sea que viajes por negocios, vacaciones o necesites un vehículo por un corto periodo,
             tenemos el auto perfecto para ti.
             `
      .split(",")
      .join("")
      .split(" ");

  const wordsToHighlight = ["RentEasy"];

  return (
    <div>
      {texto.map((word, index) => {
        if (wordsToHighlight.includes(word)) {
          return (
            <span key={index} className="highlight">
              {word}{" "}
            </span>
          );
        }
        return <span key={index}>{word} </span>;
      })}
    </div>
  );
}
