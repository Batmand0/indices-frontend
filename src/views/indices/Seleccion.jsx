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
            <Header color="toronja" section="Indices" title="" route="/" />
            <Group mt={15}>
                <BoxOption color="toronja" route="/indices/permanencia" label="Indices de Permanencia" icon="registros.svg" />
                <BoxOption color="naranja" route="/indices/egreso" label="Indices de Egreso" icon="cedulas.svg"/>
                <BoxOption color="toronja" route="/indices/titulacion" label="Indices de Titulación" icon="alumnos.svg"/>
                <BoxOption color="naranja" route="/indices/desercion" label="Indices de Deserción" icon="indices.svg"/>
            </Group>
        </div>
    );
};

export default SeleccionIndices;