import {
    Group,
 } from "@mantine/core";
import BoxOption from "src/components/BoxOption";
import Header from 'src/components/header';


const SeleccionReportes = () => {
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="naranja" section="Reportes" title="" route="/" />
            <Group mt={15}>
                <BoxOption color="naranja" route="/reportes/nuevo-ingreso" label="Nuevo Ingreso" />
                <BoxOption color="toronja" route="/reportes/egreso" label="Egresados" />
                <BoxOption color="naranja" route="/reportes/titulacion" label="Titulados" />

            </Group>
        </div>
    );
};

export default SeleccionReportes;