import React, { useEffect, useState } from "react";
import "./style.css";
import DinamicVehicle from "../../components/DinamicVehicle/dinamicVehicle";
import Vehicle from "../Vehicles/vehicle";
import OnlineReservation from "../OnlineReservation/OnlineReservation";
import Header from "./Header";
import Footer from "./Footer";
import SocialContact from "./SocialContact";
import Loading from "../../components/Loading";
import Loader from "../../components/Loading";
import CarItem from "./CarItem";
import Summarize from "./Summarize";
import LoginForm from "../../components/Login/login";
import Tip from "./Tip";
import Register from "../../components/Register";
import Slider from "./Slider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContex";

export default function PrincipalPage() {
  const [activePage, setActivePage] = useState("home");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();

  const { user } = useAuth();

  const [login_register_visibility, setLogin_Register_Visibility] =
    useState(false);

  const [SignIn, setSignIn] = useState(true);

  useEffect(() => {
    if (user) {
      setLogin_Register_Visibility(false);
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => setloading(false), 2000);
  }, []);

  const handleViewOffer = (vehicle) => {
    setSelectedVehicle(vehicle);
    setActivePage("offer");
  };

  return (
    <div className="padreePrincipalPage">
      {/* Header */}

      <div className="body-page">
        <Header
          setActivePage={setActivePage}
          setLoginVisible={() => setLogin_Register_Visibility(true)}
        />
        <div className="body-container">
          {loading ? (
            <div className="loading-container">
              <Loader />
            </div>
          ) : (
            <div className="sections-container">
              <section className="summarize-container">
                <Summarize />
              </section>
              <section className="cars-section">
                <div className="car-view">
                  <Slider />
                </div>
              </section>
              <SocialContact />
            </div>
          )}
        </div>
      </div>
      <div id="contenidoDinamico">
        {activePage === "vehicles" && navigate("/vehicle")}
        {activePage === "offer" && navigate("/onlineReservation")}

        {/* {activePage === "offer" && <OnlineReservation vehicle={selectedVehicle} />} */}
        {/* {activePage === "vehicles" && <Vehicle onViewOffer={handleViewOffer} />}
        {activePage === "offer" && (
          
          <OnlineReservation vehicle={selectedVehicle} />
        )} */}
      </div>

      {login_register_visibility && (
        <div
          onClick={() => {
            setLogin_Register_Visibility(false);
            setSignIn(true);
          }}
          className="login_register_wrapper"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="login_register_container"
          >
            {SignIn ? (
              <LoginForm setSignIn={setSignIn} />
            ) : (
              <Register setSignIn={setSignIn} />
            )}
            <Tip />
          </div>
        </div>
      )}
    </div>
  );
}
