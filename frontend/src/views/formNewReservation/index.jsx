import axios from "axios";
import Input from "../../components/Input";
import { useState } from "react";
import './style.css'

export default function FormNewReservation (props) {

    const {setData} = props;

    const [formData, setFormData] = useState({
        id_cliente: 0,
        id_Vehiculo: 0,
        FechaInicio: '2023-11-27',
        FechaFin: '2023-11-27',
        Estado: 'Pendiente',
        MetodoPago: '',
        MontoReserva: 0,
        ID_Empleado: 0,
        OrigenReserva: ''
      });

      const [errors, setErrors] = useState({});

   async function postItem(e) {
        e.preventDefault();
        console.log(formData);
        
       await axios.post("http://localhost:3000/publicProduct", formData).then(res =>{
            console.log(res.data);
        })

        await axios.get('http://localhost:3000/getAllProducts').then(res => {
            setData(res.data)
        })
     }

     const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    return (
<div className="padre">
    <div className="form-container">
        <h2>Formulario de Reservas</h2>
        <form onSubmit={(e) => postItem(e)}>
            <div className="grid-container">
                <div className="group">
                    <div className="form-group">
                        <label htmlFor="id_reserva">ID de Reserva</label>
                        <input onChange={handleChange} type="text" id="id_reserva" name="id_reserva" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="id_cliente">ID del Cliente</label>
                        <input onChange={handleChange} type="text" id="id_cliente" name="id_cliente" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="id_vehiculo">ID del Vehículo</label>
                        <input onChange={handleChange} type="text" id="id_vehiculo" name="id_vehiculo" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInicio">Fecha de Inicio</label>
                        <input onChange={handleChange} type="date" id="fechaInicio" name="fechaInicio" required/>
                    </div>
                </div>
                <div className="group">
                    <div className="form-group">
                        <label htmlFor="fechaFin">Fecha de Fin</label>
                        <input onChange={handleChange} type="date" id="fechaFin" name="fechaFin" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="MetodoPago">Método de Pago</label>
                        <select onChange={handleChange} id="MetodoPago" name="MetodoPago" required>
                            <option value="">Seleccione un método</option>
                            <option value="tarjeta">Tarjeta de Crédito</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="transferencia">Transferencia Bancaria</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="MontoReserva">Monto de la Reserva</label>
                        <input onChange={handleChange} type="number" id="MontoReserva" name="MontoReserva" step="0.01" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="origenReserva">Origen de la Reserva</label>
                        <select onChange={handleChange} id="origenReserva" name="origenReserva" required>
                            <option value="">Seleccione el origen</option>
                            <option value="web">Página Web</option>
                            <option value="oficina">Oficina</option>
                            <option value="telefono">Teléfono</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="id_empleado">ID del Empleado</label>
                    <input onChange={handleChange} type="text" id="id_empleado" name="id_empleado" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="Estado">Estado de la Reserva</label>
                    <select onChange={handleChange} id="Estado" name="Estado" required>
                        <option value="">Seleccione el estado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
                <button type="submit" className="btn-submit">Guardar Reserva</button>
            </div>
        </form>
    </div>
</div>
    )    
}


                {/* {
                  Object.keys(formData).map((item, index) => (
                            <Input
                                key={index}
                                label={item}
                                value={formData[item]}
                                onChange={handleChange}
                                placeholder="Introduce"
                                error={errors[item]}
                                name={item}
                            />
                    ))
                } */}