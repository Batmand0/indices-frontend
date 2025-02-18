import {
    Group,
 } from "@mantine/core";
import BoxOption from "src/components/BoxOption";
import Header from "src/components/header";


const SeleccionAlumnos = () => {
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Alumnos" title="" route="/" />
            <Group mt={15}>
                <BoxOption color="naranja" route="/alumnos/lista" label="Lista de Alumnos" />
                <BoxOption color="toronja" route="/alumnos/historial" label="Historial de Alumnos" />

            </Group>
        </div>
    );
};

export default SeleccionAlumnos;