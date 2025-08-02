import { useState } from "react";
import "./dinamicVehicle.css";
import DashboardAdmin from "../DashBoardAdmin/dashboardAdmin";
import { useNavigate } from "react-router-dom";

export default function DinamicVehicle({
  image,
  name,
  modelo,
  version,
  passengers,
  transmission,
  year,
  baggage,
  price,
  onViewOffer,
  vehicle,
}) {
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelected(!selected);
  };
  return (
    <div className="car-card">
      <div className="car-card__image">
        <img src={image} alt={name} className="vehicle-image" />
      </div>
      <div className="car-card__details">
        <h3 className="car-card__name">
          {name} {modelo} {version} {year}{" "}
        </h3>
        {/* <p className="car-card__type">{type}</p> */}
        <div className="car-card__info">
          <span>👤 {passengers} pasajeros</span>
          <span>🧳 {baggage} equipajes</span>
          <span>⚙ {transmission}</span>
        </div>
        <div className="car-card__price">
          <span>${price}/día</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          onViewOffer(vehicle);
          //navigate.push("/onlineReservation");
        }}
        className="car-card__button"
      >
        Ver oferta
      </button>
    </div>
  );
}
