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
            <Header color="toronja" section="Reportes" title="" route="/" />
            <Group mt={15} position="center" gap="md" style={{ flexWrap: 'wrap' }}>
                <BoxOption 
                    color="naranja" 
                    route="/reportes/nuevo-ingreso" 
                    label="Nuevo Ingreso" 
                    icon="indices.svg"
                    description="Analiza los datos de estudiantes de primer ingreso y su distribución por carrera" 
                />
                <BoxOption 
                    color="toronja" 
                    route="/reportes/egreso" 
                    label="Egresados" 
                    icon="alumnos.svg"
                    description="Visualiza las estadísticas de estudiantes que han completado sus créditos académicos"
                />
                <BoxOption 
                    color="naranja" 
                    route="/reportes/titulacion" 
                    label="Titulados" 
                    icon="cedulas.svg"
                    description="Consulta la información sobre estudiantes que han obtenido su título profesional"
                />

            </Group>
        </div>
    );
};

export default SeleccionReportes;