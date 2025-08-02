import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import "./maintenance.css";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import getInitialState from "./getInitialState";
import searchByPlaca from "./searchByPlaca";
import VehicleTableItem from "./VehicleTableItem";
import VehicleTable from "./VehicleTable";

export default function FormVehicleMaintenance() {
  const [vehicles, setVehicle] = useState([]);
  const [vehicleSelected, setvehicleSelected] = useState({
    placa: "",
  });
  const [status, setStatus] = useState([]);
  const [typeMaintenance, setTypeMaintenance] = useState([]);
  const [condition, setCondition] = useState([]);
  const [maintenanceService, setMaintenanceService] = useState([]);
  const [employee, setEmployee] = useState([]);

  const [searchPlaca, setSearchPlaca] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        status,
        typeMaintenance,
        condition,
        maintenanceService,
        employee,
      } = await getInitialState();

      setStatus(status);
      setTypeMaintenance(typeMaintenance);
      setCondition(condition);
      setMaintenanceService(maintenanceService);
      setEmployee(employee);
    };
    fetchData();
  }, []);

  const calculateCost = () => {
    const costos = vehicles.filter((veh) => veh.costo).map((veh) => veh.costo);

    return costos.reduce((acc, costo) => acc + costo, 0);
  };

  const handleSearchByPlaca = () => {
    const placaExistence = vehicles.find(
      (veh) => veh.placa.toLocaleLowerCase() === searchPlaca.toLocaleLowerCase()
    );

    if (placaExistence) {
      Swal.fire("Error", "El vehículo ya fue agregado", "error");
    } else {
      searchByPlaca({
        searchPlaca,
        setVehicle,
        setvehicleSelected,
      });
    }
  };

  const onDedelete = (placa) => {
    setVehicle(vehicles.filter((veh) => veh.placa !== placa));
  };

  const handleMant = (key, value, placa) => {
    const v = vehicles.find((veh) => veh.placa === placa);

    v[key] = value;

    const newVehicles = vehicles.map((veh) => {
      if (veh.placa === placa) {
        return {
          ...veh,
          [key]: value,
        };
      }

      return veh;
    });

    setVehicle(newVehicles);
  };

  const filteredServices =
    vehicles.find((veh) => veh.placa === vehicleSelected.placa)?.services || [];

  const handleSubmit = async (values) => {
    console.log({
      ...values,
      detalles: vehicles,
    });

    //  values.detalles = arrayDetalleMantenimiento;

     try {
       await axios.post("http://localhost:3000/api/VehicleMaintenance", values);
       Swal.fire("Éxito", "Mantenimiento registrado correctamente", "success");
     } catch (error) {
       console.error("Error al registrar el mantenimiento:", error);
       Swal.fire(
         "Error",
         "Hubo un problema al registrar el mantenimiento",
         "error"
       );
     }
  };

  return (
    <section className="sectionMaintenance">
      <header>
        <h1>Mantenimiento de Vehículo</h1>
      </header>

      <div className="group">
        <label>Buscar Vehículo por Placa:</label>
        <input
          type="text"
          placeholder="Ingrese la placa"
          value={searchPlaca}
          onChange={(a) => setSearchPlaca(a.target.value)}
          className="input"
        />
        <button onClick={handleSearchByPlaca} className="button">
          Buscar
        </button>
      </div>

      <Formik
        initialValues={{
          id_empleado: "",
          costo: 0,
          fechaMantenimiento: "",
          id_tipoMantenimiento: 0,
          id_condicion: "",
          id_estado_a_i: "1",
          id_servicio: "",
          detalles: [],
        }}
        onSubmit={(values, { resetForm }) => {
          const gc = calculateCost();

          handleSubmit({
            ...values,
            costo: gc,
            detalles: vehicles,
          });
          // setArrayDetalleMantenimiento([]);
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="group">
              <div className="field">
                <label className="label">Empleado Responsable</label>
                <div className="control">
                  <Select
                    options={employee.map((emp) => ({
                      value: emp.id_empleado,
                      label: `${emp.nombre} ${emp.apellido}`,
                    }))}
                    placeholder="Seleccione un empleado"
                    onChange={(selected) =>
                      setFieldValue("id_empleado", selected?.value || "")
                    }
                    isSearchable
                  />
                  <ErrorMessage
                    name="id_empleado"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Costo</label>
                <div className="control">
                  <Field
                    disabled
                    className="input"
                    value={calculateCost()}
                    type="number"
                    name="costo"
                    placeholder="Costo"
                  />
                  <ErrorMessage
                    name="costo"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Fecha de Mantenimiento</label>
                <div className="control">
                  <Field
                    className="input"
                    type="date"
                    name="fechaMantenimiento"
                  />
                  <ErrorMessage
                    name="fechaMantenimiento"
                    component="p"
                    className="help is-danger"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <div className="field">
                <label className="label">Condición</label>
                <div className="control">
                  <Field as="select" name="id_condicion">
                    <option value="">Seleccionar</option>
                    {condition.map((item) => (
                      <option key={item.id_condicion} value={item.id_condicion}>
                        {item.nombre}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>

              <div className="field">
                <label className="label">Estado</label>
                <div className="control">
                  <Field as="select" name="id_estado_a_i" disabled>
                    <option value="">Seleccionar</option>
                    {status.map((item) => (
                      <option
                        key={item.id_estado_a_i}
                        value={item.id_estado_a_i}
                      >
                        {item.estado}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>

              <div className="field">
                <label className="label">Servicios</label>
                <div className="control">
                  <Select
                    isClearable={false}
                    isHidden={true}
                    options={maintenanceService.map((s) => ({
                      value: s.id_servicio,
                      label: s.nombre,
                    }))}
                    value={filteredServices}
                    isMulti
                    placeholder="Seleccione los servicios"
                    onChange={(selected) =>
                      handleMant("services", selected, vehicleSelected.placa)
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Tipo de Mantenimiento</label>
                <div className="control">
                  <Field
                    as="select"
                    name="id_tipoMantenimiento"
                    value={
                      vehicles.find(
                        (veh) => veh.placa === vehicleSelected.placa
                      )?.id_tipoMantenimiento || ""
                    }
                    onChange={(e) => {
                      setFieldValue("id_tipoMantenimiento", e.target.value);
                      handleMant(
                        "id_tipoMantenimiento",
                        e.target.value,
                        vehicleSelected.placa
                      );
                    }}
                  >
                    <option value="">Seleccionar</option>
                    {typeMaintenance.map((type) => (
                      <option
                        key={type.id_tipoMantenimiento}
                        value={type.id_tipoMantenimiento}
                      >
                        {type.nombre}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
            </div>
            <div className="table-section">
              <h2>Vehículo encontrado</h2>
              <VehicleTable>
                {vehicles.map((veh, index) => (
                  <VehicleTableItem
                    key={index}
                    {...veh}
                    setCosto={setFieldValue}
                    onPriceChange={handleMant}
                    onDelete={onDedelete}
                    onClick={() => setvehicleSelected({ placa: veh.placa })}
                    selected={vehicleSelected.placa === veh.placa}
                  />
                ))}
              </VehicleTable>
            </div>

            <div className="field-is-grouped">
              <div className="control">
                <button
                  disabled={vehicles.length === 0}
                  style={{
                    cursor: vehicles.length === 0 ? "not-allowed" : "pointer",
                  }}
                  className="button-is-primary"
                  type="submit"
                >
                  Confirmar Mantenimiento
                </button>
              </div>
              <div className="control">
                <button className="button-is-light" type="reset">
                  Cancelar
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
