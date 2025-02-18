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
                <BoxOption color="toronja" route="/indices/permanencia" label="Indices de Permanencia" />
                <BoxOption color="naranja" route="/indices/egreso" label="Indices de Egreso" />
                <BoxOption color="toronja" route="/indices/titulacion" label="Indices de Titulación" />
                <BoxOption color="naranja" route="/indices/desercion" label="Indices de Deserción" />
            </Group>
        </div>
    );
};

export default SeleccionIndices;