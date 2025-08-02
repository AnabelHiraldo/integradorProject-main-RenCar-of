import "./style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "../../Icon";

export default function Reservas() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [200, 500, 1000];
  const [modal, setmodal] = useState(false)
  const [itemSelected, setitemSelected] = useState()

  const CustomButtonComponent = (props) => {
    return (
      <Icon
        style={{
          color: "blue",
          cursor: "pointer",
        }}
        name="eye-line"
        onclick={() => {
          setitemSelected(props.data);
          setmodal(true)
        }}
      ></Icon>
    );
  };

  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID",
      field: "id_reserva",
      width: 100,
    },
    {
      headerName: "Nombre del cliente",
      field: "cliente",
    },
    {
      headerName: "Subtotal",
      field: "subTotal",
    },
    {
      headerName: "Total",
      field: "total",
    },
    {
      headerName: "Condicion",
      field: "nombre_condicion",
    },

    {
      headerName: "Fecha de reserva",
      field: "fechaReserva",
    },
    { field: "action", cellRenderer: CustomButtonComponent, flex: 1 },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/reserva/all")
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="reservas_cont">
      <h1>Reservas</h1>

      <div
        className="ag-theme-quartz"
        style={{
          height: "50vh",
        }}
      >
        <AgGridReact
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          rowData={rowData}
          columnDefs={columnDefs}
        />
        <div className="modal_reservas" style={{
          display: modal ? 'block' : 'none'
        }}>
          <div className="modal_child">
            <Icon name="close-large-line" style={{
              color: 'red',
              cursor: 'pointer',
              position: 'absolute',
              top: '10px',
              right: '10px'
            }} onclick={() => setmodal(false)}></Icon>


            {JSON.stringify(itemSelected)}
          </div>
        </div>
      </div>
    </div>
  );
}
