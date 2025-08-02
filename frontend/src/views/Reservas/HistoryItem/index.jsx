
import './style.css';
import Icon from "../../../components/Icon";

export default function HistoryItem({ history, handleSeeHistory }) {
  return (
    <div className="history_item">
      <span>{history.name}</span>

      <Icon name='eye-line' onclick={handleSeeHistory} style={{
        cursor: 'pointer'
      }}/> 
    </div>
  );
}
