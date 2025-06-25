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
            <Group mt={15} gap="md" position="center" style={{ flexWrap: 'wrap' }}>
                <BoxOption 
                    color="toronja" 
                    route="/tablas/poblacion" 
                    label="Tablas de Población" 
                    icon="tablas.svg"
                    description="Visualiza y analiza la distribución de la población estudiantil por periodos"
                />
                <BoxOption 
                    color="naranja" 
                    route="/tablas/crecimiento" 
                    label="Tablas de Crecimiento" 
                    icon="indices.svg"
                    description="Examina las tendencias de crecimiento y evolución estudiantil por carrera"
                />
            </Group>
        </div>
    );
};

export default SeleccionTablas;