import { useEffect, useState } from "react";
// import './App.css'
import axios from "axios";
import FormNewReservation from "./views/formNewReservation";
import FormNewClient from "./views/formNewClient";
import PrincipalPage from "./views/principalPage/prinicpalPage";
import ViewOfertVehicle from "./components/ViewOfertVehicle/ViewOfertVehicle";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginForm from "./components/Login/login";
import AdminDashboard from "./components/MenuAdmin/index";
import ClientDashboard from "./views/principalPage/prinicpalPage";
import Vehicle from "./views/Vehicles/vehicle";
import FormVehicleMaintenance from "./components/FormVehicleMaintenance/maintenance";
import MailConfirmation from "./views/mailConfirmation";
import OnlineReservation from "./views/OnlineReservation/OnlineReservation";
import Paypal from "./PaypalApi/Paypal";
import EntregaReserva from "./components/EntregaRecepcionVehicle/Reserva/entregaReserva";
import { useAuth } from "./contexts/AuthContex";
import Reservas from "./views/Reservas";
import GenerarContrato from "./components/Contrato/Contrato";
import AnulacionPuntos from "./components/Consultas/AnulacionPuntos";
import RecepcionRenta from "./components/EntregaRecepcionVehicle/Recepcion/InspeccionRecepcion/RecepcionRenta";
import CancelarReserva from "./components/CancelarReserva/CancelarReserva";

function App(selectedVehicle, handleViewOffer) {
  const { login } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<ClientDashboard/>} />
        {/* <Route path="/login" element={<Paypal />} /> */}
        <Route path="/reservas" element={<Reservas />} />

        <Route path="/confirm-email" element={<MailConfirmation />} />
        {/* <Route path="/onlineReservation" element={<OnlineReservation vehicle={selectedVehicle} />} /> */}
        <Route
          path="/vehicle"
          element={<Vehicle onViewOffer={handleViewOffer} />}
        />
        <Route path="/entregaInspeccion" element={<EntregaReserva />} />
        <Route path="/RecepcionRenta" element={<RecepcionRenta />} />


        
        {/*<PrincipalPage handleMenuChange={ handleMenuChange } menuStatus={ menuStatus }/>*/}
        {/* <Vehicle /> */}
        {/* Ruta para usuarios no autorizados */}
        <Route
          path="/unauthorized"
          element={<h1>No tienes acceso autorizado</h1>}
        />

        {/* Ruta protegida para administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[2,3]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para clientes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
         <Route
        path="/anularp"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            {/* id_rol 1 para administrador */}
            <AnulacionPuntos />
          
          </ProtectedRoute>
        }
      />

        {/* Ruta compartida (ambos roles) */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRoles={[2, 1]}>
              <Vehicle />
            </ProtectedRoute>
          }
        />

        {/* Ruta predeterminada */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta para no encontrados */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
