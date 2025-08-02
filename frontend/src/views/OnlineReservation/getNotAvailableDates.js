import axios from "axios";
import formatDate from "./formatDate";

export default async function getNotAvailableDates(
  setNotAvailableDates,
  vehicle
) {
  const responsePlotica = await axios.get(
    `http://localhost:3000/api/vehicle/plotica/${vehicle?.id_vehiculo}`
  );

  
  setNotAvailableDates(formatDate(responsePlotica.data));
}
