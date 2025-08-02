import React, { useState } from "react";
import "./notificacion.css"; 

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
};

export default Notification;

