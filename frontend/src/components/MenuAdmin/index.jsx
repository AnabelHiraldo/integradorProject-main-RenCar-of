import { useEffect, useState } from "react";
import "./styleMenuAdmin.css";
import { itemsMenu } from "../../config/menu-items";
import DashboardAdmin from "../DashBoardAdmin/dashboardAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faChartLine,
  faCog,
  faFileAlt,
  faLocationArrow,
  faTachometerAlt,
  faTools,
  faUsers,
  faClipboardList,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContex";
import Swal from "sweetalert2";
import Icon from "../Icon";

export default function MenuAdmin(props) {
  const { menuStatus, handleMenuChange } = props;

  const { user } = useAuth();

  const [open, setopen] = useState(false);
  const [childrens, setchildrens] = useState([]);
  const [fatherActived, setfatherActived] = useState("");
  const [component, setComponent] = useState(<></>);
  const [miEmpresa, setMiEmpresa] = useState([]);
  const [tab, setTab] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/api/myCompany").then((response) => {
      setMiEmpresa(response.data[0]);
      // console.log(response.data);
    });
  }, []);

  useEffect(() => {
    if (component) {
      setComponent(<DashboardAdmin />);
    }
  }, []);

  // useEffect(() => {
  //   if (component === null) {
  //     setfatherActived("")
  //     setComponent(<></>)
  //     setComponent(<DashboardAdmin />);
  //   }
  // }, []);

  return (
    <div className="father1MenuAdmin">
      <div className="empresaLog">
        <img src="imageLogo.png" alt="imageLogo Logo" />
        <span
          style={{
            fontSize: "20px",
            color: "white",
          }}
        >
          {miEmpresa.nombre}
        </span>
      
        {user && (
          <span
            style={{
              color: "white",
              fontFamily: "Arial, sans-serif",
              position: "absolute",
              right: "1rem",
              fontSize: "18px",
              fontWeight: "bold",
              marginLeft: "1rem",
            }}
          >
            {user.nombre}
          </span>
        )}
      </div>
      <div className="child1">
        <nav className="nav">
          <ul className="list">
            <li className="list__item">
              <div
                className="list__button"
                onClick={() => {
                  setComponent(<DashboardAdmin />);
                  setfatherActived(""); // Desactivar submenús
                }}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="list__img" />
                <a href="#" id="inicio" className="nav__link">
                  Tablero
                </a>
              </div>
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Mantenimientos") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Mantenimientos");
                  }
                }}
              >
                <FontAwesomeIcon icon={faTools} className="list__img" />
                <a href="" className="nav__link">
                  Mantenimientos
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Mantenimientos" ? "rotated" : ""
                  }`}
                />
              </div>
              {fatherActived === "Mantenimientos" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        className="itemsDent"
                        key={index}
                        onClick={() => {
                          setComponent(item.component);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li className="list__item">
              <div
                className="list__button"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Estadisticas") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Estadisticas");
                  }
                }}
              >
                <FontAwesomeIcon icon={faChartLine} className="list__img" />
                <a href="" className="nav__link">
                  Estadísticas
                </a>
              </div>
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Procesos") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Procesos");
                  }
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} className="list__img" />
                <a href="" className="nav__link">
                  Procesos
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Procesos" ? "rotated" : ""
                  }`}
                />
              </div>

              {fatherActived === "Procesos" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <>
                        {item.title === "Modificar Reserva" ? (
                          <>
                            <div
                              key={index}
                              onClick={() => {
                                if (item.acceso[0] === user.id_rol) {
                                  setComponent(item.component);
                                } else {
                                  Swal.fire({
                                    title: "No tienes acceso a esta area",
                                    icon: "info",
                                  });
                                }
                              }}
                            >
                              {item.title}
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              key={index}
                              onClick={() => {
                                setComponent(item.component);
                              }}
                            >
                              {item.title}
                            </div>
                          </>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Entregas") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Entregas");
                  }
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} className="list__img" />
                <a href="" className="nav__link">
                  Entregas
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Entregas" ? "rotated" : ""
                  }`}
                />
              </div>

              {fatherActived === "Entregas" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setComponent(item.component);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Acuerdos") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Acuerdos");
                  }
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} className="list__img" />
                <a href="" className="nav__link">
                  Acuerdos
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Acuerdos" ? "rotated" : ""
                  }`}
                />
              </div>

              {fatherActived === "Acuerdos" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setComponent(item.component);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Consultas") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Consultas");
                  }
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} className="list__img" />
                <a href="" className="nav__link">
                  Consultas
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Consultas" ? "rotated" : ""
                  }`}
                />
              </div>
              {fatherActived === "Consultas" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setComponent(item.component);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li className="list__item list__item--click">
              <div className="list__button list__button--click">
                <FontAwesomeIcon icon={faFileAlt} className="list__img" />
                <a href="" className="nav__link">
                  Reportes
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="list__arrow"
                />
              </div>
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Ubicacion") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Ubicacion");
                  }
                }}
              >
                <FontAwesomeIcon icon={faLocationArrow} className="list__img" />
                <a href="" className="nav__link">
                  Ubicación
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Ubicacion" ? "rotated" : ""
                  }`}
                />
              </div>
              {fatherActived === "Ubicacion" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setComponent(item.component);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Usuarios") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Usuarios");
                  }
                }}
              >
                <FontAwesomeIcon icon={faUsers} className="list__img" />
                <a href="" className="nav__link">
                  Usuarios
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Usuarios" ? "rotated" : ""
                  }`}
                />
              </div>

              {fatherActived === "Usuarios" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setComponent(item.component);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Fidelizacion") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Fidelizacion");
                  }
                }}
              >
                <FontAwesomeIcon icon={faCog} className="list__img" />
                <a href="" className="nav__link">
                  Fidelizacion
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Fidelizacion" ? "rotated" : ""
                  }`}
                />
              </div>
              {fatherActived === "Fidelizacion" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (item.acceso[0] === user.id_rol) {
                            setComponent(item.component);
                          } else {
                            Swal.fire({
                              title: "No tienes acceso a esta area",
                              icon: "info",
                            });
                          }
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li className="list__item list__item--click">
              <div
                className="list__button list__button--click"
                onClick={(e) => {
                  e.preventDefault();
                  if (fatherActived === "Configuraciones") {
                    setfatherActived("");
                    setchildrens([]);
                  } else {
                    setfatherActived("Configuraciones");
                  }
                }}
              >
                <FontAwesomeIcon icon={faCog} className="list__img" />
                <a href="" className="nav__link">
                  Configuraciones
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`list__arrow ${
                    fatherActived === "Configuraciones" ? "rotated" : ""
                  }`}
                />
              </div>
              {fatherActived === "Configuraciones" && (
                <div className="ItemsDinamicMenu">
                  <div className="contentDinamic">
                    {itemsMenu[fatherActived].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setComponent(item.component);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <a className="plotica"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{
                  // padding: "8px 16px",
                  // backgroundColor: "rgb(217, 136, 128)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  margin: "5px",
                }}
              >
               <Icon name="logout-box-line"/> Cerrar Sesión
              </a>
          </ul>
        </nav>
        <section className="sectionContainer">
          <div id="container">{component}</div>
        </section>
      </div>
    </div>
  );
}
