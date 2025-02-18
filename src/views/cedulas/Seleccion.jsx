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
                <BoxOption color="toronja" route="/cedulas/cacei" label="Cédulas CACEI" />
                <BoxOption color="naranja" route="/cedulas/caceca" label="Cédulas CACECA" />

            </Group>
        </div>
    );
};

export default SeleccionCedulas;