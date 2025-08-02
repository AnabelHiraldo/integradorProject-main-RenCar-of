import { useEffect, useState } from "react";
import CarItem from "../CarItem";
import "./style.css";

const staticData = [
  {
    title: "RentEasy",
    imgSRC: "camaro.png",
    carItem: {
      color: "#9db9dc",
      ph: "RD$ 1,000.00",
      model: "Toyota Corolla",
    },
  },
  {
    title: "RentEasy",
    imgSRC: "mercedes.png",
    carItem: {
      color: "#f92202",
      ph: "RD$ 500.00",
      model: "Toyota Corolla",
    },
  },
];

export default function Slider() {
  const [item, setitem] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (item === 1) {
        setitem(0);
      }

      if (item === 0) {
        setitem(1);
      }
    }, 5000);

    return () => clearInterval(timer); // Limpieza al desmontar
  });

  return (
    <>
      <button className="slider-btn-left">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M14 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            // stroke-width="2"
          />
        </svg>
      </button>

      <>
        <img
          draggable={false}
          src={staticData[item].imgSRC}
          alt={staticData[item].title}
          style={{}}
          className="car-img"
        />
        <CarItem {...staticData[item].carItem} />
        <h4 className="car-view-title" style={{
            color: staticData[item].carItem.color
        }}>{staticData[item].title}</h4>
      </>

      {/* {staticData.map((data, index) => (
        <>
          
        </>
      ))} */}
      <button className="slider-btn-right">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M10 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            // stroke-width="2"
          />
        </svg>
      </button>
    </>
  );
}
