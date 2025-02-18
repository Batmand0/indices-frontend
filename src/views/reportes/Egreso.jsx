import { Button, Checkbox, Flex, Group, Loader } from '@mantine/core';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import Dropdown from 'src/components/Dropdown';
import {  useState } from 'react';
import { useInputState } from '@mantine/hooks';
import dropDownData from 'src/mockup/dropDownData';
import "src/views/indices/Indices.css";
import { getReportesHeaders } from 'src/utils/helpers/headerHelpers';
import { generatePDF } from 'src/utils/helpers/export/pdfHelpers';
import { Download, Printer, X } from 'tabler-icons-react';
import { generateExcel } from 'src/utils/helpers/export/excelHelpers';
import { getReportesEgresoTitulacion } from 'src/routes/api/controllers/reportesController';
import { buildTablaReportes } from '../../utils/helpers/reportesHelpers';
import { notifications } from '@mantine/notifications';

const ReportesEgreso = () => {
    // Heading y data almacenan la informacion de los encabezados y el contenido de la tabla, respectivamente
    const [data, setData] = useState([]);
    const [heading, setHeading] = useState([[], [], []]);
    // Cohorte, carrera y numSemestres son los datos de los Select
    const [cohorte, setCohorte] = useInputState('');
    const [exportar, setExportar] = useInputState('');
    // const [carrera, setCarrera] = useInputState('');
    const [numSemestres, setNumSemestre] = useInputState(0);
    const [examenYConv, setExamenYConv] = useState(true);
    const [trasladoYEquiv, setTrasladoYEquiv] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleTable = async() => {
        setIsLoading(true);
        const tabla = await getReportesEgresoTitulacion('egreso', examenYConv, trasladoYEquiv, cohorte, numSemestres);
        if (tabla.status === 200) {
            try {
                const headers = await getReportesHeaders(2, cohorte, numSemestres);
                setHeading(headers);
                const reporte = buildTablaReportes(tabla.data);
                setData(reporte);
            } catch (error) {
                setHeading([[],[], []]);
                setData([]);
                notifications.show({
                    message: 'Lo sentimos, hubo un problema al generar la tabla',
                    color: 'red',
                    icon: <X />,
                });
            }
        } else {
            setHeading([[], [], []]);
            setData([]);
            notifications.show({
                message: 'Lo sentimos, hubo un problema al obtener los datos',
                color: 'red',
                icon: <X />,
              });
        }
        setIsLoading(false);
    };

    const handlePrint = async() => {
        const tipoAlumno = examenYConv && trasladoYEquiv ? 1 : examenYConv ? 2 : 3;
        try {
            if (exportar === 'PDF') {
                await generatePDF('Egreso', cohorte, numSemestres, heading, data, false, examenYConv, trasladoYEquiv);
            } else if (exportar === 'Excel') {
                await generateExcel(heading, data, 'Egreso', cohorte, numSemestres, tipoAlumno);
            }
            notifications.show({
                message: 'La descarga de tu documento ha comenzado.',
                color: 'teal',
                icon: <Download size={20} />,
              });
        } catch (e) {
            notifications.show({
                message: 'Lo sentimos, hubo un problema al generar su documento',
                color: 'red',
                icon: <X />,
                });
        }
    };
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Reportes" title="Egreso" route="/reportes" />
            <Flex direction="column">
                <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group mt={0} mb={16} color='gris'>
                        <Dropdown  label="Cohorte generacional" color="#FF785A" handleChangeFn={setCohorte} data={dropDownData.getCohortes()} />
                        <Dropdown  label="Cálculo de semestres" color="#FF785A" handleChangeFn={setNumSemestre} data={dropDownData.numSemestres} />
                        <Dropdown  label="Exportar" color="#FF785A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>
                    <Group mt={0} mb={16} >
                        <Checkbox labelPosition='left' color='toronja' checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox labelPosition='left' color='toronja' checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end" }} >
                        <Button  disabled={!cohorte || !numSemestres || !exportar || !(examenYConv || trasladoYEquiv) || data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='naranja'>Imprimir</Button>
                        <Button onClick={handleTable} disabled={(!cohorte || !numSemestres || !(examenYConv || trasladoYEquiv)) && !isLoading} color='negro'>{isLoading ? <Loader size='sm'  color='#FFFFFF' /> : 'Filtrar'}</Button>
                    </Group>
                </fieldset>
                <Tabla colors="tabla-toronja" tripleHeader  headers={heading} content={data} />
            </Flex>
        </div>
    );
};

export default ReportesEgreso;