import {
    Group,
 } from "@mantine/core";
import BoxOption from "src/components/BoxOption";
import Header from 'src/components/header';


const SeleccionTablas = () => {
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Tablas" title="" route="/" />
            <Group mt={15}>
                <BoxOption color="toronja" route="/tablas/poblacion" label="Tablas de Población" />
                <BoxOption color="naranja" route="/tablas/crecimiento" label="Tablas de Crecimiento" />
            </Group>
        </div>
    );
};

export default SeleccionTablas;