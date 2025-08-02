import axios from "axios";
import Swal from "sweetalert2";

export default async function setNewPassword(password) {
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/user/createNewPassword`,
      {
        password,
      }
    );

    if (response.data.message === "Contraseña actualizada con éxito") {
      let timerInterval;
      Swal.fire({
        title: "¡Alerta de cierre automático!",
        html: `
              Contraseña actualizada con éxito.
              <br>
            Seras redirigido a la página de inicio de sesión.
          `,
        timer: 5000,
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
        window.location.href = "/login"; //TODO: we have to change this to the correct path
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al cambiar la contraseña",
    });
  }
}
