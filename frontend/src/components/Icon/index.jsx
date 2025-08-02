export default function Icon({ name, onclick, style }) {
  return <i style={style} onClick={onclick} className={`ri-${name}`}></i>;
}
