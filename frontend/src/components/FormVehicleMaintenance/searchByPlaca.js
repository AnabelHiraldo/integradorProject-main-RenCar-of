import axios from "axios";
import Swal from "sweetalert2";

export default async function searchByPlaca ({
    searchPlaca,
    setVehicle,
    setvehicleSelected,
}) {
    if (!searchPlaca.trim()) {
      Swal.fire(
        "Error",
        "Ingrese un número de placa para buscar el vehículo",
        "error"
      );
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/vehicle/${searchPlaca}`
      );
      setVehicle((prev) => [
        ...prev,
        {
          ...res.data[0],
          services: [],
        },
      ]);

      setvehicleSelected((prev) => ({
        placa: res.data[0].placa,
      }));

      Swal.fire("Éxito", "Vehículo encontrado", "success");
    } catch (error) {
      Swal.fire("Error", "No se encontró un vehículo con esa placa", "error");
    }
  };