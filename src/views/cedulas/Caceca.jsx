import { Button, Checkbox, Flex, Group, Loader } from '@mantine/core';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import Dropdown from 'src/components/Dropdown';
import {  useEffect, useState } from 'react';
import { useInputState } from '@mantine/hooks';
import dropDownData from 'src/mockup/dropDownData';
import "src/views/indices/Indices.css";
import { Download, Printer, X } from 'tabler-icons-react';
import { generatePDF } from 'src/utils/helpers/export/pdfHelpers';
import { generateExcel } from 'src/utils/helpers/export/excelHelpers';
import { getCedulasTabla } from 'src/routes/api/controllers/cedulaController';
import { notifications } from '@mantine/notifications';

const CedulaCaceca = () => {
    const [isLoading, setIsLoading] = useState(false);
    // Heading y data almacenan la informacion de los encabezados y el contenido de la tabla, respectivamente
    const [heading, setHeading] = useState([]);
    const [data, setData] = useState([]);
    // Cohorte, carrera y numSemestres son los datos de los Select
    const [cohorte, setCohorte] = useInputState('');
    const [carrera, setCarrera] = useInputState('');
    const [exportar, setExportar] = useInputState('');
    const [examenYConv, setExamenYConv] = useState(true);
    const [trasladoYEquiv, setTrasladoYEquiv] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarreras();
        setCarreras(c);
    };

    const header = [
        'Generaciones', 'Ingreso', 'Deserción', 'Indice de deserción', 'Reprobación', 'Indice de reprobación', 'Egreso', 'Titulación', 'Indice de titulación', 'Eficiencia terminal'
    ];

    useEffect(() => {
        fetchCarreras();
        setData([
            []
        ]);
    }, []);

    const handleTable = async() => {
        setIsLoading(true);
        const res = await getCedulasTabla('caceca', examenYConv, trasladoYEquiv, cohorte, carrera);
        if (res.status === 200) {
            const tablaC =Object.entries(res.data);
            const tabla = [];
            tablaC.forEach((fila) => {
                const row = [];
                row.push(fila[0]);
                row.push(fila[1].poblacion, fila[1].desercion, `${fila[1].tasa_desercion}%`, fila[1].reprobacion, `${fila[1].tasa_reprobacion}%`, fila[1].egresados, fila[1].titulados, `${fila[1].tasa_titulacion}%`, `${fila[1].tasa_egreso}%`);
                tabla.push(row);
            });
            setHeading(header);
            setData(tabla);
        } else {
            setHeading([]);
            setData([[]]);
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
        if (exportar === 'PDF') {
            generatePDF('Cédulas CACECA', cohorte, '15', carrera);
        } else if (exportar === 'Excel') {
             await generateExcel(heading, data, 'CACECA', cohorte, '15', tipoAlumno, carrera);
        }
        notifications.show({
            message: 'La descarga de tu documento ha comenzado.',
            color: 'teal',
            icon: <Download size={20} />,
          });
    };
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="naranja" section="Cédulas" title="CACECA" route="/cedulas" />
            <Flex direction="column">
                <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group mt={0} mb={16} color='gris'>
                        { carreras.length > 0 ? <Dropdown  label="Programa educativo" color="#FFAA5A" handleChangeFn={setCarrera} data={carreras} /> : null }
                        <Dropdown  label="Cohorte generacional" color="#FFAA5A" handleChangeFn={setCohorte} data={dropDownData.getCohortes()}/>
                        <Dropdown  label="Exportar" color="#FFAA5A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>
                    <Group mt={0} mb={16} >
                        <Checkbox labelPosition='left' color='naranja'  checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox labelPosition='left' color='naranja'  checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end" }} >
                        <Button  disabled={!cohorte || !carrera || !exportar || !(examenYConv || trasladoYEquiv) || data[0].length === 0} onClick={handlePrint} leftIcon={<Printer />} color='toronja'>Imprimir</Button>
                        <Button disabled={(!cohorte || !carrera || !(examenYConv || trasladoYEquiv))&& !isLoading} onClick={handleTable} color='negro'>{isLoading ? <Loader size='sm' color='#FFFFFF'/>  : "Filtrar"}</Button>
                    </Group>
                </fieldset>
                <Tabla colors="tabla-naranja" headers={heading} content={data} />
            </Flex>
        </div>
    );
};

export default CedulaCaceca;