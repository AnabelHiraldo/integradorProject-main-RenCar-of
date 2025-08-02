import axios from "axios";

export default async function getInitialState() {
    const [
        statusRes,
        typeMaintenanceRes,
        conditionRes,
        maintenanceServiceRes,
        employeeRes,
      ] = await Promise.all([
        axios.get("http://localhost:3000/api/status"),
        axios.get("http://localhost:3000/api/typeMaintenance"),
        axios.get("http://localhost:3000/api/condition"),
        axios.get("http://localhost:3000/api/maintenanceService"),
        axios.get("http://localhost:3000/api/employee"),
      ]);

      return {
        status: statusRes.data,
        typeMaintenance: typeMaintenanceRes.data,
        condition: conditionRes.data,
        maintenanceService: maintenanceServiceRes.data,
        employee: employeeRes.data,
      }
}