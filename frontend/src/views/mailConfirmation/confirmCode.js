import axios from "axios";
import { set } from "date-fns";
import Swal from "sweetalert2";

export default async function confirmCode(code, setnewPassword) {
  console.log("code", code);
  
  try {
    
    const response = await axios.get(
      `http://localhost:3000/api/user/confirmCode/${code}`
    );
    
    if (response.data.message === "Código confirmado con éxito") {
      setnewPassword(true)
    }

    if (response.data.message === "Código incorrecto") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Código incorrecto",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error en la confirmación",
    });
  }
}
