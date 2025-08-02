import Icon from "../../../components/Icon";
import "./style.css";

export default function ReservationItem({
  reservation,
  deleteAction,
  editAction,
}) {

  return (
    <div className="reservation_item">
      <div className="reservation_details_cont">
      {/* <span>{reservation.marca}</span>
      <span>{reservation.modelo}</span> */}
      </div>
      <div className="reservation_item_actions">
        <Icon
          onclick={editAction}
          style={{
            cursor: "pointer",
          }}
          name="edit-line"
        />
        <Icon
          onclick={deleteAction}
          style={{
            cursor: "pointer",
          }}
          name="close-circle-fill"
        />
      </div>
    </div>
  );
}
