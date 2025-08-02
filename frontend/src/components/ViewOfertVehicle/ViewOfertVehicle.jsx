import "./ViewOfertVehicle.css";

export default function ViewOfertVehicle({capacidadPersonas,modelo,precio, año, color, combustible, transmision, traccion, onClose}) {
    return (
        <div className="offer-details">
          <button className="closeModal" onClick={onClose}>
            X
          </button>
          <div className="offer-header">
            <h1>{modelo} {año}</h1>
            {/* <h2>US$ {vehicle.price}</h2> */}
          </div>
          <div className="offer-images">
            <img src="Mercedez.jpeg" alt="" className="main-image"/>
            {/* <img src={vehicle.mainImage} alt={vehicle.model} className="main-image" /> */}
            <div className="thumbnail-images">
            <img src="ProjectCar.jpg" alt="" className="thumbnail"/>
            <img src="blackCar.png" alt="" className="thumbnail"/>

              {/* {vehicle.images.map((img, index) => (
                <img key={index} src={img} alt={`Thumbnail ${index}`} className="thumbnail" />
              ))} */}
            </div>
          </div>
          <div className="offer-info">
            <div className="general-info">
              <h3>Datos Generales</h3>
              <p><strong>Precio:</strong> US$ {precio}</p>
              <p><strong>Color:</strong> {color}</p>
              <p><strong>Capacidad de personas:</strong> {capacidadPersonas}</p>
              <p><strong>Combustible:</strong> {combustible}</p>
              <p><strong>Transmisión:</strong> {transmision}</p>
              <p><strong>Tracción:</strong> {traccion}</p>
            </div>
            <div className="electric-info">
              <h3>Vehículo Eléctrico</h3>
              {/* <p><strong>Potencia:</strong> {"vehicle.power"}</p>
              <p><strong>Rango:</strong> {"vehicle.rang"} Km</p> */}
              {/* <p><strong>Tiempo de Carga:</strong> {vehicle.chargeTime}</p> */}
            </div>
          </div>
          <div className="contact-section">
            <button className="btn-contact">Mas</button>
            {/* <button className="btn-test-drive">Solicitar Test Drive</button> */}
          </div>
        </div>
      );
}
