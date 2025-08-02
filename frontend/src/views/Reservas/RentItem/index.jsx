import Icon from "../../../components/Icon";
import "./style.css";

export default function RentItem({ rent, deleteAction, editAction }) {
  return (
    <div className="rent_item">
      <span>Renta #{rent.id_renta}</span>
      <div className="rent_item_actions">
        <Icon
          onclick={editAction}
          style={{
            cursor: "pointer",
          }}
          name="edit-line"
        />
        {/* <Icon
          onclick={deleteAction}
          style={{
            cursor: "pointer",
          }}
          name="delete-bin-line"
        /> */}
      </div>
    </div>
  );
}
