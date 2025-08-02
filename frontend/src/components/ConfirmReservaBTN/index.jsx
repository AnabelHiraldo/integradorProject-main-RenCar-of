import "./style.css";

export default function ConfirmReservaBTN({ onClick }) {
  return (
    <button onClick={onClick} class="menu__button">
      <span>Confirmar reserva</span>
    </button>
  );
}
