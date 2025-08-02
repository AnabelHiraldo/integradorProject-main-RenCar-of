import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import "./index.css";
import "bulma/css/bulma.min.css";
import 'remixicon/fonts/remixicon.css'
import { AuthProvider } from "./contexts/AuthContex.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <AuthProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <App />
      </div>
    </AuthProvider>
  // </StrictMode>
);