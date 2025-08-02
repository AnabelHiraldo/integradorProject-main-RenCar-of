import "./style.css";

export default function CarItem({ color, ph, model }) {
  return (
    <div className="item-container">
      <div className="details">
        <div
          className="car-color"
          style={{
            backgroundColor: color,
          }}
        />
        <span className="division" />
        <div className="price-h">
          <span style={{
            color: color
          }}>P/H</span>
          <h2>{ph}</h2>
        </div>
        <span className="division" />
        <div className="modelo">
          <span style={{
            color: color
          }}>Modelo</span>
          <h2>{model}</h2>
        </div>
      </div>
      {/* <button className="rent-btn">RENTAR</button> */}
    </div>
  );
}
