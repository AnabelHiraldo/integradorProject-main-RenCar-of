export default function VehicleTable({children}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Versión</th>
                    <th>Color</th>
                    <th>Año</th>
                    <th>Costo</th>
                    <th>fecha Inicio</th>
                    <th>Fecha estimada</th>
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    );
}