import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "./style.css";

export default function RentEasyDatePicker({
  selectedDate,
  setSelectedDate,
  setBlockedDates,
  selectedDays = [],
  dates = [],
}) {
  const today = new Date();
  const [bd, setBD] = useState([]);

  const getReservationBlockedDays = () => {
    let ReservationBlockDays = [];

    if (dates.length === 0) {
      return ReservationBlockDays;
    }

    if (dates.length > 0) {
      for (const r of dates) {
        if (r.fechaInicioReserva && r.fechaFinReserva) {
          const fI = new Date(String(r.fechaInicioReserva).replace(/-/g, ","));
          const fF = new Date(String(r.fechaFinReserva).replace(/-/g, ","));

          while (fI <= fF) {
            ReservationBlockDays.push(new Date(fI));
            fI.setDate(fI.getDate() + 1);
          }
        }

        if (r.fechaInicioReserva && !r.fechaFinReserva) {
          ReservationBlockDays.push(new Date(r.fechaInicioReserva));
        }

        if (!r.fechaInicioReserva && r.fechaFinReserva) {
          ReservationBlockDays.push(new Date(r.fechaFinReserva));
        }
      }
    }

    return ReservationBlockDays;
  };

  // const blockedDates = [
  //   ...getReservationBlockedDays(),
  // ];

  useEffect(() => {
    setBD([...getReservationBlockedDays()]);
  }, [dates]);

  useEffect(() => {
    setBlockedDates(bd);
  }, [bd]);

  const highlightBlockedDays = (date) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.toISOString().split("T")[0];

    const isBlocked = bd.some(
      (blockedDate) =>
        date.getFullYear() === blockedDate.getFullYear() &&
        date.getMonth() === blockedDate.getMonth() &&
        date.getDate() === blockedDate.getDate()
    );
    return date < yesterday ? "disabled-date" : isBlocked ? "blocked-day" : "";
  };

  return (
    <div className="picker-container">
      <DatePicker
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
        }}
        className="custom-input"
        excludeDates={bd}
        dayClassName={(date) => highlightBlockedDays(date)}
        placeholderText="Elige una fecha"
        dateFormat="yyyy-MM-dd"
      />
    </div>
  );
}
