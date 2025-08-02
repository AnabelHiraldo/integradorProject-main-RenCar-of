import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./components/Login/login";
import AdminDashboard from "./components/MenuAdmin/index";
import ClientDashboard from "./views/principalPage/prinicpalPage";
import NotFound from "./components/Shared/NotFound";
import MailConfirmation from "./views/mailConfirmation";
import OnlineReservation from "./views/OnlineReservation/OnlineReservation";
import Vehicle from "./views/Vehicles/vehicle";
import EntregaReserva from "./components/EntregaRecepcionVehicle/Reserva/entregaReserva";
import Reservas from "./views/Reservas";
import AnulacionPuntos from "./components/Consultas/AnulacionPuntos";
import Swal from "sweetalert2";
import RecepcionRenta from "./components/EntregaRecepcionVehicle/Recepcion/InspeccionRecepcion/RecepcionRenta";
// Componente de rutas protegidas
const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // Bloquear la redirección hasta que el estado esté cargado
  if (!role) {
    return <p>Cargando...</p>;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Definición de rutas
const AppRoutes = ({ isAuth, idRol, selectedVehicle, handleViewOffer }) => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/entregaInspeccion" element={<EntregaReserva />} />
      <Route path="/RecepcionRenta" element={<RecepcionRenta />} />


      
      <Route
        path="/unauthorized"
        element={<h1>No tienes acceso autorizado</h1>}
      />
      <Route path="/reservas" element={<Reservas />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/confirm-email" element={<MailConfirmation />} />
      <Route
        path="/onlineReservation"
        element={<OnlineReservation vehicle={selectedVehicle} />}
      />
      <Route
        path="/vehicle"
        element={<Vehicle onViewOffer={handleViewOffer} />}
      />

      {/* Rutas protegidas */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute isAuth={isAuth} idRol={idRol} allowedRoles={[2,3]}>
            {/* id_rol 2 para administrador */}
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
       <Route
        path="/anularp"
        element={
          <ProtectedRoute isAuth={isAuth} idRol={idRol} allowedRoles={[2]}>
            {/* id_rol 1 para administrador */}
            {
              idRol === 2 ? (  <AnulacionPuntos />) : (Swal.fire({
                title: "Acceso denegado",
                icon: "info"
              }))
            }
          
          </ProtectedRoute>
        }
      />
      <Route
        path="/client"
        element={
          <ProtectedRoute isAuth={isAuth} idRol={idRol} allowedRoles={[1]}>
            {/* id_rol 2 para cliente */}
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
