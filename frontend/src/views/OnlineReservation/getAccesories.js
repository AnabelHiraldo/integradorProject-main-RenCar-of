import axios from "axios";

export default async function getAccesories(setAccessories, vehicle) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/accesory/${vehicle?.id_vehiculo}`
    );

    setAccessories(response.data);
    // console.log(response.data);
  } catch (error) {
    console.error("Error al obtener los accesorios:", error);
  }
}
