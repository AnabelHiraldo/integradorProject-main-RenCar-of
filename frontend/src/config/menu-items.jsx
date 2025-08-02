import FormClients from "../components/FormClients/index.jsx";
import FormVehicles from "../components/FormVehicles/index.jsx";
import FormEmployees from "../components/FormEmployees/index.jsx";
import FormCompany from "../components/FormCompany/index.jsx";
import FormPosition from "../components/FormPosition/index.jsx";
import FormSupplier from "../components/FormSupplier/index.jsx";
import FormReservation from "../components/FormReservation/indexReservation.jsx";
import FormAccesory from "../components/FormAccesory/index.jsx";
import FormCategory from "../components/FormCateogry/FormCategory.jsx";
import FormBrand from "../components/FormBrand/FormBrand.jsx";
import FormModel from "../components/FormModel/FormModel.jsx";
import FormVersion from "../components/FormVersion/FormVersion.jsx";
import FormCountry from "../components/FormCountry/FormCountry.jsx";
import FormProvince from "../components/FormProvince/FormProvince.jsx";
import FormCity from "../components/FormCity/FormCity.jsx";
import FormCondition from "../components/FormCondition/FormCondition.jsx";
import FormVehicleType from "../components/FormVehicleType/FormTypeVehicle.jsx";
import FormMyCompany from "../components/FormMyCompany/FormMyCompany.jsx";
import FormStatus from "../components/FormStatus/FormStatus.jsx";
import FormFuel from "../components/FormFuel/FormFuel.jsx";
import FormPaymentMethod from "../components/FormPaymentMethod/FormPaymentMethod.jsx";
import FormRole from "../components/FormRole/FormRole.jsx";
import FormUser from "../components/FormUsers/FormUser.jsx";
import FormPermission from "../components/FormPermision/FormPermission.jsx";
import FormColor from "../components/FormColor/FormColor.jsx";
import FormBrakeSystem from "../components/FormBrakeSystem/FormBrakeSystem.jsx";
import FormTraction from "../components/FormTraction/FormTraction.jsx";
import FormConfigPuntos from "../components/FormConfigPuntos/FormConfigPuntos.jsx";
import FormRents from "../components/FormRents/FormRents.jsx";
import ReservasActivas from "../components/ModificarReserva/ModificarReserva.jsx";
import FormVehicleMaintenance from "../components/FormVehicleMaintenance/maintenance.jsx";
import FormAccident from "../components/FormAccident/accident.jsx";
import LoginForm from "../components/Login/login.jsx";
import FormAnularPuntos from "../components/Fidelizacion/FormAnularPuntos/FormAnularPuntos.jsx";
import FormCompraVehicles from "../components/FormCompraVehicle/index.jsx";
import EntregasRecepcion from "../components/EntregaRecepcionVehicle/EntregaRecepcion.jsx";
import Reservas from "../components/Consultas/Reservas/index.jsx";
import Clientes from "../components/Consultas/Clientes/index.jsx";
import Rentas from "../components/Consultas/Rentas/index.jsx";
import FormConfigRenovacion from "../components/FormConfiRenovacion/FormConfigRenovacion.jsx";
import FormPoliticaPagoReserva from "../components/FormConfigPayPoliticReserva/FormConfiRenovacion/FormConfigPoliticaPagoReserva.jsx";
import CanjeoPuntos from "../components/Consultas/CanjeoPuntos/index.jsx";
import RegistroPuntos from "../components/Consultas/RegistroPuntos/index.jsx";
import AnulacionPuntos from "../components/Consultas/AnulacionPuntos/index.jsx";
import Recepcion from "../components/EntregaRecepcionVehicle/Recepcion/Recepcion.jsx";
import { components } from "react-select";
import FormPropietario from "../components/FormPropietario/index.jsx";
import FormAcuerdo from "../components/FormAcuerdo/index.jsx";
import ArchivosVehiculos from "../components/Consultas/archivosVehiculos/archivosVehiculos.jsx";
import Vehiculos from "../components/Consultas/Vehiculos/index.jsx";
import Empleados from "../components/Consultas/Empleados/index.jsx";
import Marcas from "../components/Consultas/Marcas/index.jsx";
import Usuarios from "../components/Consultas/Usuarios/index.jsx";
import FormMoneda from "../components/FormMoneda/moneda.jsx";
// import FormVehiclePart from "../components/FormVehiclePart/part.jsx";
import FormDamage from "../components/FormDamage/damage.jsx";
import FormPoliticaCancel from "../components/FormPoliticaCancel/cancel.jsx";
import FormCancelReason from "../components/FormCancelReason/reason.jsx";
import FormVehiclePart from "../components/FormVehiclePart/part.jsx";
import PayPropietario from "../components/Consultas/PayPropietarios/index.jsx";
import FormTypeBills from"../components/FormTypeBills/FormTypeBills.jsx";




export const itemsMenu = {
  Mantenimientos: [
    {
      title: "Clientes",
      component: <FormClients />,
    },
    {
      title: "Propietarios",
      component: <FormPropietario />,
    },
    {
      title: "Vehiculos",
      component: <FormVehicles />,
      children: [
        {
          titulo: "dd",
        },
      ],
    },
    {
      title: "Empleados",
      component: <FormEmployees />,
    },
    {
      title: "My Empresa",
      component: <FormMyCompany />,
    },
    {
      title: "Empresa",
      component: <FormCompany />,
    },
    {
      title: "Sistema de frenos",
      component: <FormBrakeSystem />,
    },
    {
      title: "Posicion",
      component: <FormPosition />,
    },
    {
      title: "Proveedor",
      component: <FormSupplier />,
    },
    {
      title: "TipoVehiculo",
      component: <FormVehicleType />,
    },
    {
      title: "accesorio",
      component: <FormAccesory />,
    },
    {
      title: "categoria",
      component: <FormCategory />,
    },
    {
      title: "marca",
      component: <FormBrand />,
    },
    {
      title: "modelo",
      component: <FormModel />,
    },
    {
      title: "version",
      component: <FormVersion />,
    },
    {
      title: "Traccion",
      component: <FormTraction />,
    },
    {
      title: "Color",
      component: <FormColor />,
    },
    {
      title: "condicion",
      component: <FormCondition />,
    },
    {
      title: "Estado",
      component: <FormStatus />,
    },
    {
      title: "Combustible",
      component: <FormFuel />,
    },
    {
      title: "Metodo de Pago",
      component: <FormPaymentMethod />,
    },
    {
      title: "Control Manteminiemto",
      component: <FormVehicleMaintenance />,
    },
    {
      title: "Accidentes",
      component: <FormAccident />,
    },
    {
      title: "Moneda",
      component: <FormMoneda />,
    },
    {
      title: "Partes de Vehiculo",
      component: <FormVehiclePart/>,
    },

    {
      title: "Daños",
      component: < FormDamage />,
    },
    {
      title: "Razones de cancelacion",
      component: < FormCancelReason />,
    },
    {
      title: "Tipos de Ingresos ",
      component: < FormTypeBills />,
    },
  ],
  Procesos: [
    {
      title: "Reservas",
      component: <FormReservation />,
    },
    {
      title: "Rentas",
      component: <FormRents />,
    },
    {
      title: "Compras",
      component: <FormCompraVehicles />,
    },
    {
      title: "Ventas",
      component: <></>,
    },
    {
      title: "Modificar Reserva",
      acceso: [2],
      component: <ReservasActivas />,
    },
    {
      title: "Reparacion y mantenimientos",

      component: <FormVehicleMaintenance />,
    },
  ],

  Entregas: [
    {
      title: "Entregas",
      component: <EntregasRecepcion />,
    },
    {
      title: "Recepcion",
      component: <Recepcion />,
    },


  ],
  Acuerdos: [
    {
      title: "Crear Acuerdo",
      component: <FormAcuerdo />,
    }
  ],

  Estadisticas: [
    {
      title: "Reservas",
      component: <></>,
    },
    {
      title: "Rentas",
      component: <></>,
    },
    {
      title: "Compras",
      component: <></>,
    },
    {
      title: "Ventas",
      component: <></>,
    },
  ],
  Consultas: [
    {
      title: "Reservas",
      component: <Reservas />,
    },
    {
      title: "Clientes",
      component: <Clientes />,
    },
    {
      title: "Rentas",
      component: <Rentas />,
    },
    {
      title: "Pagos a Propietarios",
      component: <PayPropietario />,
    },
    
    {
      title: "Canjeo de Puntos",
      component: <CanjeoPuntos />,
    },
    {
      title: "Registro de Puntos",
      component: <RegistroPuntos />,
    },
    {
      title: "Anulacion de Puntos",
      component: <AnulacionPuntos />,
    },
    {
      title: "Archivos Vehiculos",
      component: <ArchivosVehiculos/>,
    },
    {
      title: "Empleados",
      component: <Empleados/>,
    },
    {
      title: "Vehiculos",
      component: <Vehiculos/>,
    },

    {
      title: "Marcas",
      component: <Marcas/>,
    },
    {
      title: "Usuarios",
      component: <Usuarios/>,
    },
    {
      title: "Ventas",
      component: <></>,
    },
    {
      title: "Compras",
      component: <></>,
    },
  ],
  Ubicacion: [
    {
      title: "pais",
      component: <FormCountry />,
    },
    {
      title: "provincia",
      component: <FormProvince />,
    },
    {
      title: "ciudad",
      component: <FormCity />,
    },
  ],
  Usuarios: [
    {
      title: "Usuarios",
      component: <FormUser />,
    },
    {
      title: "Permisos",
      component: <FormPermission />,
    },
    {
      title: "Roles",
      component: <FormRole />,
    },
  ],
  Fidelizacion: [
    {
      title: "Anular Puntos",
      component: <FormAnularPuntos />,
      acceso: [2],
    },
  ],
  Configuraciones: [
    {
      title: "configuraciones Puntos",
      component: <FormConfigPuntos />,
    },
    {
      title: "Renovacion Renta",
      component: <FormConfigRenovacion />,
    },
    {
      title: "Pago Reserva",
      component: <FormPoliticaPagoReserva />,
    },
    {
      title: "Politica de Cancelacion",
      component: < FormPoliticaCancel />,
    },
  ],
};
