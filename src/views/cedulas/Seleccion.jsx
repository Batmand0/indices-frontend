import {
    Group,
 } from "@mantine/core";
import BoxOption from "src/components/BoxOption";
import Header from 'src/components/header';


const SeleccionCedulas = () => {
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Cédulas" title="" route="/" />
            <Group mt={15}>
                <BoxOption color="toronja" route="/cedulas/cacei" label="Cédulas CACEI" icon="registros.svg"/>
                <BoxOption color="naranja" route="/cedulas/caceca" label="Cédulas CACECA" icon="indices.svg"/>

            </Group>
        </div>
    );
};

export default SeleccionCedulas;