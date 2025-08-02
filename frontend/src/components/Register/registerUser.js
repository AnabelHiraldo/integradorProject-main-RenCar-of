import axios from "axios";
import Swal from "sweetalert2";

export default async function registerUser(values) {
  try {
    const obj = {
      email: values.email,
      username: values.nombre,
      id_estado_a_i: 1,
    };

    const response = await axios.post("http://localhost:3000/api/user", obj);

    if (response.data.message === "Usuario registrado con éxito") {
      let timerInterval;
      Swal.fire({
        title: "¡Alerta de cierre automático!",
        html: `
            Seras redirigido a la página confirmación de correo electrónico.
        `,
        timer: 4500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 1000);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(() => {
        window.location.href = "/confirm-email";
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error en el registro",
    });
  }
}
