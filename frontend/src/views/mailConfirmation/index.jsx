import { useState } from "react";
import ConfirmationCode from "./ConfirmationCode";
import "./style.css";
import CreateNewPassword from "./CreateNewPassword";

export default function MailConfirmation() {
  const [newPassword, setnewPassword] = useState(false);

  return (
    <div className="mail-confirmation-container">
      <div className="logo-mail-c">
        <a href="#" onClick={() => setActivePage("home")}>
          Rent
        </a>
        <span className="easy">Easy</span>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
            // justifyContent: "center",
            // marginTop: "50px",
          }}
        >
          <h2 className="confirmation-title">¡Bienvenido a RentEasy!</h2>
          <p className="confirmation-text">
            Hemos enviado un código de confirmación a tu{" "}
            <span
              style={{
                color: "#FFC300",
                fontWeight: "bold",
              }}
            >
              correo electrónico
            </span>
            .
          </p>
          <div style={{
            display: "flex",
            flexDirection: "row",
          }}>
            <ConfirmationCode newPassword={newPassword} setnewPassword={setnewPassword}/>
            {newPassword && <CreateNewPassword />}
          </div>
        </div>
      </div>
    </div>
  );
}
