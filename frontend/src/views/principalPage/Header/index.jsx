import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContex";
import "./style.css";

export default function Header({ setActivePage, setLoginVisible }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const options = [
    { value: "home", label: "Inicio" },
    { value: "vehicles", label: "Vehículos" },
    { value: "about", label: "Nosotros" },
    { value: "services", label: "Servicios" },
    { value: "contact", label: "Contacto" },
  ];

  const clientOps = [
    { value: "/reservas", label: "Reserva" },
    { value: "login", label: "Renta" },
  ];

  return (
    <header className="header">
      <div className="menu margen-interno">
        <div className="logo">
          <a href="#" onClick={() => setActivePage("home")}>
            Rent
          </a>
          <span className="easy">Easy</span>
        </div>

        <div className="nav">
          {options.map((option, index) => (
            <a href="#" key={index} onClick={() => setActivePage(option.value)}>
              {option.label}
            </a>
          ))}

          {user &&
            clientOps.map((option, index) => (
              <a href="#" key={index} onClick={() => {
                navigate(option.value);
              }}>
                {option.label}
              </a>
            ))}
        </div>

        <div className="social">
          {/* <div>
            <a href="#">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
          <div>
            <a href="https://www.instagram.com/m.colon_28/">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div> */}

          {!user ? (
            <button
              onClick={setLoginVisible}
              className="button-87"
              role="button"
            >
              Iniciar sesion
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Ícono de usuario */}
              {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a10 10 0 0 1 13 0" />
      </svg> */}

              {/* Botón de cerrar sesión */}
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
