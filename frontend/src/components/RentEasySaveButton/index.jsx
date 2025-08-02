import "./style.css";

export default function RentEasySaveButton({ text, onClick, type }) {
  return <button onClick={onClick} type={type} className="button"> {text}</button>;
}
