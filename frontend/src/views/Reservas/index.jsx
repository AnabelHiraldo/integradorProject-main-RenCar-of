import { useEffect, useState } from "react";
import GoBackButton from "../../components/GoBackButton";
import Icon from "../../components/Icon";
import { history, rents, reservations } from "../../config/reservations";
import HistoryItem from "./HistoryItem";
import RentItem from "./RentItem";
import ReservationItem from "./ReservationItem";
import "./style.css";
import { data, useNavigate } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import RentForm from "./RentForm";
import HistoryForm from "./HistoryForm";
import Swal from "sweetalert2";
import ReservasActivas from "../../components/ModificarReserva/ModificarReserva";
import OnlineReservationModifier from "../../components/OnlileModifierReserva/OnlineModificarReserva";
import { dataMap } from "../../config/data";
import axios from "axios";

export default function Reservas() {
  const navigate = useNavigate();
  const [client, setclient] = useState("");
  const [itemToEdit, setitemToEdit] = useState({});
  const [activedRese, setactivedRese] = useState([]);
  const [rents, setrents] = useState([]);
  const [initialState, setinitialState] = useState({});

  useEffect(() => {
    const getLocalStorage = async () => {
      const user = await JSON.parse(localStorage.getItem("user"));

      setclient(user.nombre ?? "");
    };

    getLocalStorage();
  }, []);

  useEffect(() => {
    let id_cliente = 1;
    axios
      .get("http://localhost:3000/api/rent/getDispByClient/estees", {
        params: { id_cliente },
      })
      .then((response) => {
        // console.log(response.data)

        const rentasAgrupadas = response.data.reduce((acc, renta) => {
          const existingRenta = acc.find((r) => r.id_renta === renta.id_renta);

          if (existingRenta) {
            existingRenta.detalles.push({
              id_renta: renta.id_renta || null,
              id_vehiculo: renta.id_vehiculo || "Sin ID",
              id_version: renta.id_veersion || null,
              marca: renta.marca || null,
              modelo: renta.modelo || null,
              version: renta.Veersion || null,
              color: renta.color || null,
              año: renta.año || null,
              placa: renta.placa || null,
              fechaInicio: renta.fechaInicio || null,
              fechaFin: renta.fechaFin || null,
              id_marca: renta.id_marca || null,
              id_modelo: renta.id_modelo || null,
              id_veersion: renta.id_veersion || null,
              total: renta.total || null,
              precio: renta.precio || null,
              imagen_url: renta.imagen_url || null,
            });
          } else {
            acc.push({
              id_renta: renta.id_renta || "Sin Renta",
              cliente: renta.cliente || "Cliente Desconocido",
              total: renta.total || 0,
              detalles: [
                {
                  id_renta: renta.id_renta || null,
                  id_vehiculo: renta.id_vehiculo || "Sin ID",
                  id_version: renta.id_veersion || null,
                  marca: renta.marca || null,
                  modelo: renta.modelo || null,
                  version: renta.Veersion || null,
                  color: renta.color || null,
                  año: renta.año || null,
                  fechaInicio: renta.fechaInicio || null,
                  fechaFin: renta.fechaFin || null,
                  id_marca: renta.id_marca || null,
                  id_modelo: renta.id_modelo || null,
                  id_veersion: renta.id_veersion || null,
                  total: renta.total || null,
                  precio: renta.precio || null,
                  imagen_url: renta.imagen_url || null,
                  placa: renta.placa || null,
                },
              ],
            });
          }

          return acc;
        }, []);

        setactivedRese(rentasAgrupadas);
      });
  }, []);

  const [form, setform] = useState("");

  const handleeditReservation = () => {
    setform("reservation");
  };
  // const handleCancelReservation = () => {
  //   Swal.fire({
  //     title: "¿Estás seguro?",
  //     text: "No podrás revertir esta acción",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Sí, cancelar",
  //     cancelButtonText: "No, conservar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire("Cancelado", "La reserva ha sido cancelada", "success");
  //     }
  //   });
  // };

  const handleEditRent = (rent) => {
    setinitialState({
      id_renta: 0,
      id_vehiculo: 0,
      id_version: 0,
      marca: "",
      modelo: "",
      version: "",
      color: "",
      año: 0,
      fechaInicio: "",
      fechaFin: "",
      id_marca: 0,
      id_modelo: 0,
      id_veersion: 0,
      total: 0,
      precio: 0,
      imagen_url: "",
      placa: "",
    });
    setform("rent");
    setrents(rent);
  };
  const handleDeleteRent = () => {
    setform("rent");
  };

  const handleSeeHistory = () => {
    setform("history");
  };

  return (
    <div className="reservas_container">
      <header>{/* <h1 className="reservas_title">Reservas</h1> */}</header>

      <div className="section_container">
        <section className="user_data">
          <div className="user__name">
            <span>{client}</span>
            <GoBackButton
              style={{
                position: "absolute",
                top: "20px",
                left: "5px",
              }}
              onclick={() => navigate("/")}
            />
          </div>
          <div className="actived_reservations">
            {/* <span> */}
            <h2>Reservas activas</h2>
            {/* </span> */}

            <button onClick={handleeditReservation}>
              Consultar reservas activas
            </button>
            {/* <div className="reservations"> */}
            {/* {[{
                leo: ""
              }].map((reservation, index) => (
                <ReservationItem
                  reservation={reservation}
                  key={index}
                  deleteAction={handleCancelReservation}
                  editAction={() => handleeditReservation(reservation)}
                />
              ))} */}
            {/* </div> */}
          </div>

          <div className="current_rents">
            <span>
              <h2>Rentas en curso</h2>
            </span>

            <div className="rents">
              {activedRese.map((rent, index) => (
                <RentItem
                  rent={rent}
                  key={index}
                  deleteAction={handleDeleteRent}
                  editAction={() => handleEditRent(rent)}
                />
              ))}
            </div>
          </div>

          <div className="rental_history">
            <span>
              <h2>Historial</h2>
            </span>

            <div className="history_items">
              {history.map((rent, index) => (
                <HistoryItem
                  history={rent}
                  key={index}
                  handleSeeHistory={handleSeeHistory}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="reservas_info">
          {form === "reservation" ? (
            <OnlineReservationModifier />
          ) : // <ReservationForm reservation={itemToEdit} client={reservation.cliente} setform={setform}/>
          form === "rent" ? (
            <RentForm
              rents={rents}
              initialState={initialState}
              setinitialState={setinitialState}
            />
          ) : form === "history" ? (
            <HistoryForm />
          ) : (
            <></>
          )}
        </section>
      </div>
    </div>
  );
}
