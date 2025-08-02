import DeleteIcon from "../../../assets/DeleteIcon";

export default function VehicleTableItem({
  placa,
  marca,
  modelo,
  veersion,
  color,
  año,
  costo,
  setCosto,
  fechaInicio,
  fecha_estimada,
  selected,
  onClick,
  onDelete,
  onPriceChange,
  onDateChange,
}) {
  const items = [placa, marca, modelo, veersion, color, año];
  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getUTCFullYear();
    const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + d.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };
  return (
    <>
      <tr
        style={{
          backgroundColor: selected ? "lightblue" : "white",
        }}
      >
        {items.map((item, index) => (
          <td key={index} onClick={onClick}>
            {item}
          </td>
        ))}
        <td
          style={{
            width: "2vw",
          }}
        >
          <input
            type="number"
            value={costo ?? 0}
            onChange={(e) =>
              onPriceChange(
                "costo",
                !e.target.value ? 0 : parseInt(e.target.value),
                placa
              )
            }
            style={{
              height: "3vh",
              borderRadius: "5px",
              padding: "5px",
              border: "none",
              outline: "none",
            }}
          />
        </td>
        <td
          style={{
            width: "2vw",
          }}
        >
          <input
            type="date"
            value={fechaInicio ?? ""}
            onChange={(e) =>
              onPriceChange(
                "fechaInicio",
                !e.target.value ? "" : formatDate(e.target.value),
                placa
              )
            }
            style={{
              height: "3vh",
              borderRadius: "5px",
              padding: "5px",
              border: "none",
              outline: "none",
            }}
          />
        </td>  <td
          style={{
            width: "2vw",
          }}
        >
          <input
            type="date"
            value={fecha_estimada ?? ""}
            onChange={(e) =>
              onPriceChange(
                "fecha_estimada",
                !e.target.value ? "" : formatDate(e.target.value),
                placa
              )
            }
            style={{
              height: "3vh",
              borderRadius: "5px",
              padding: "5px",
              border: "none",
              outline: "none",
            }}
          />
        </td>
        <td
          style={{
            display: "flex",
            height: "48px",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <DeleteIcon onClick={() => onDelete(placa)} />
        </td>
      </tr>
    </>
  );
}
