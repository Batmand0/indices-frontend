import {
    Group,
 } from "@mantine/core";
import BoxOption from "src/components/BoxOption";
import Header from 'src/components/header';


const SeleccionIndices = () => {
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="naranja" section="Indices" title="" route="/" />
            <Group mt={15} position="center" gap="md">
                <BoxOption 
                    color="toronja" 
                    route="/indices/permanencia" 
                    label="Indices de Permanencia" 
                    icon="registros.svg"
                    description="Analiza la retención estudiantil y la continuidad académica por generación y carrera" 
                />
                <BoxOption 
                    color="naranja" 
                    route="/indices/egreso" 
                    label="Indices de Egreso" 
                    icon="cedulas.svg"
                    description="Examina las tasas de eficiencia terminal por generación y carrera"
                />
                <BoxOption 
                    color="toronja" 
                    route="/indices/titulacion" 
                    label="Indices de Titulación" 
                    icon="alumnos.svg"
                    description="Visualiza las tasas de obtención de títulos profesionales"
                />
                <BoxOption 
                    color="naranja" 
                    route="/indices/desercion" 
                    label="Indices de Deserción" 
                    icon="indices.svg"
                    description="Monitorea las tasas de abandono escolar y sus tendencias por carrera"
                />
            </Group>
        </div>
    );
};

export default SeleccionIndices;