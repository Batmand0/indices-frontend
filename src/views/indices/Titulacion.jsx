import { Button, Checkbox, Flex, Group, Loader } from '@mantine/core';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import Dropdown from 'src/components/Dropdown';
import { useEffect, useRef, useState } from 'react';
import { useInputState } from '@mantine/hooks';
import dropDownData from 'src/mockup/dropDownData';
import "./Indices.css";
import { getIndicesHeaders } from 'src/utils/helpers/headerHelpers';
import { Download, Printer, X } from 'tabler-icons-react';
import { buildTablaIndices, buildTablaIndicesGeneracional } from 'src/utils/helpers/indicesHelpers';
import { getIndicesData, getIndicesDataGeneracional } from 'src/routes/api/controllers/indicesController';
import { generatePDF } from 'src/utils/helpers/export/pdfHelpers';
import { generateExcel } from 'src/utils/helpers/export/excelHelpers';
import { notifications } from '@mantine/notifications';
import DataChart from 'src/components/charts/DataChart';


const IndiceTitulacion = () => {
    const [isLoading, setIsLoading] = useState(false);
    // Heading y data almacenan la informacion de los encabezados y el contenido de la tabla, respectivamente
    const [heading, setHeading] = useState([[],[]]);
    const [data, setData] = useState([]);

    // chartData y chartType almacenan la información del gráfico, aunque en este caso no se usa
    const [chartData, setChartData] = useState(null);
    const [chartType, setChartType] = useState('line');
    // Cohorte, carrera y numSemestres son los datos de los Select
    const [cohorte, setCohorte] = useInputState('');
    const [carrera, setCarrera] = useInputState('');
    const [numSemestres, setNumSemestre] = useInputState(0);
    const [exportar, setExportar] = useInputState('');
    const [examenYConv, setExamenYConv] = useState(true);
    const [trasladoYEquiv, setTrasladoYEquiv] = useState(false);
    const chartRef = useRef(null);

    // Nuevo estado para modo generacional
    const [modoGeneracional, setModoGeneracional] = useState(false);

    const [carreras, setCarreras] = useState([]);
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarreras();
        c.push({'value': 'TODAS', 'label': 'TODAS LAS CARRERAS'});
        setCarreras(c);
    };

    // Cargar carreras cuando el componente se monta
    useEffect(() => {
        if (modoGeneracional) {
            // Limpiar datos cuando se cambia a modo generacional
            setHeading([[], []]);
            setData([]);
        }
        fetchCarreras();
    }, [modoGeneracional]);

    const prepareChartData = (tableData, chartType) => {
        // Extraer periodos únicos
        const periodos = new Set();
        tableData.forEach((row) => {
            const periodo = row[1];
            periodos.add(periodo);
        });

        if (modoGeneracional) {
            return {
                labels: tableData.map((row) => row[0]), // Generaciones
                datasets: [
                    {
                        label: 'Tasa de Titulación',
                        data: tableData.map((row) => parseFloat(row[3])), // Tasa de retención
                        borderColor: 'rgb(255, 120, 90)',
                        backgroundColor: 'rgb(253, 167, 148)'
                    }
                ]
            };
        } else {
            // Para modo no generacional
            const datasets = [];
            const periodosList = Array.from(periodos);
            
            // Crear un dataset por cada tipo de dato (Hombres, Mujeres, Total)
            const datosHombres = tableData.map((row) => parseFloat(row[6]));
            const datosMujeres = tableData.map((row) => parseFloat(row[7]));
            const datosTotal = datosHombres.map((h, idx) => h + datosMujeres[idx]);

            if (chartType === 'bar') {
                datasets.push({
                    label: 'Hombres titulados',
                    data: datosHombres,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                });

                datasets.push({
                    label: 'Mujeres tituladas',
                    data: datosMujeres,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1
                });

                datasets.push({
                    label: 'Total de titulados',
                    data: datosTotal,
                    backgroundColor: 'rgba(255, 120, 90, 0.5)',
                    borderColor: 'rgb(255, 120, 90)',
                    borderWidth: 1
                });
            } else {
                // Para gráfica de línea
                datasets.push({
                    label: 'Tasa de Titulación',
                    data: tableData.map((row) => parseFloat(row[8].replace('%', ''))),
                    borderColor: 'rgb(255, 120, 90)',
                    backgroundColor: 'rgb(253, 167, 148)',
                    tension: 0.1
                });
            }

            return {
                labels: periodosList,
                datasets: datasets
            };
        }
    };
    // Manejador para generar la tabla con los datos filtrados
    const handleTable = async() => {
        setIsLoading(true);
        try {
            if (modoGeneracional) {
                // Nueva lógica para modo generacional
                const tabla = await getIndicesDataGeneracional('titulacion', {
                    examenYConv,
                    trasladoYEquiv,
                    cohorteInicial: cohorte,
                    carrera,
                    numSemestres
                });
        
                if (tabla.status === 200) {
                    // Headers para vista generacional
                    const headers = [
                        [`Titulados a ${numSemestres} semestres por Generación`],
                        ['Generación', 'Total Inicial', 'Total Actual', 'Tasa de Titulación']
                    ];
                    setHeading(headers);
                    const datos = buildTablaIndicesGeneracional('titulacion', tabla.data, numSemestres);
                    setData(datos);
                    setChartData(prepareChartData(datos));
                } else {
                    throw new Error('Error al obtener datos generacionales');
                }
            } else {
                // Lógica existente para modo normal
                const tabla = await getIndicesData('titulacion', examenYConv, trasladoYEquiv, cohorte, carrera, numSemestres);
                        
                if (tabla.status === 200) {
                    const headers = await getIndicesHeaders(3, cohorte, carrera);
                    setHeading(headers);
                    const datos = buildTablaIndices('titulacion', tabla.data, numSemestres);
                    setData(datos);
                    setChartData(prepareChartData(datos));
                } else {
                    throw new Error('Error al obtener datos normales');
                }
            }
        } catch (error) {
            setHeading([[],[]]);
            setData([]);
            notifications.show({
                message: 'Lo sentimos, hubo un problema al generar la tabla',
                color: 'red',
                icon: <X />,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = async() => {
        const tipoAlumno = examenYConv && trasladoYEquiv ? 1 : examenYConv ? 2 : 3;
        try {
            if (exportar === 'PDF') {
                await generatePDF(
                    'Titulación', 
                    cohorte, 
                    numSemestres, 
                    heading, 
                    data, 
                    false, 
                    examenYConv, 
                    trasladoYEquiv, 
                    carrera,
                    chartRef // Pasar la referencia de la gráfica
                );
            } else if (exportar === 'Excel') {
                await generateExcel(heading, data, 'Indice Titulación', cohorte, numSemestres, tipoAlumno);
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

    useEffect(() => {
        if (data.length > 0) {
            setChartData(prepareChartData(data, chartType));
        }
    }, [chartType]);

    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header 
                color="toronja" 
                section="Indices" 
                title={`Titulación ${modoGeneracional ? 'Generacional' : 'por cohorte generacional'}`}  
                route="/indices" 
            />
            <Flex align="center" justify="center" direction="column">
            <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group position="center" mt={0} mb={16} color='gris'>
                        { carreras.length > 0 ? <Dropdown  label="Programa educativo" color="#FF785A" handleChangeFn={setCarrera} data={carreras} /> : null }
                        <Dropdown  label={modoGeneracional ? "Cohorte inicial" : "Cohorte generacional"} color="#FF785A" data={dropDownData.getCohortes()} handleChangeFn={setCohorte} />
                        <Dropdown  label="Cálculo de semestres" color="#FF785A" data={dropDownData.numSemestres.slice(5)} handleChangeFn={setNumSemestre} />
                        <Dropdown  label="Exportar" color="#FF785A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>
                    <Group position="center" mt={0} mb={16} >
                        <Checkbox labelPosition='left' checked={modoGeneracional} onChange={(event) => setModoGeneracional(event.currentTarget.checked)} label='Modo Generacional' radius='sm' />
                        <Checkbox labelPosition='left' checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox labelPosition='left' checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end" }} >
                        <Button  disabled={!cohorte || !numSemestres || !exportar || !(examenYConv || trasladoYEquiv) || data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='naranja'>Imprimir</Button>
                        <Button onClick={handleTable} color='negro' disabled={(!cohorte || !carrera || !numSemestres || !(examenYConv || trasladoYEquiv)) && !isLoading} >{isLoading ? <Loader size='sm' color='#FFFFFF'/>  : "Filtrar"}</Button>
                    </Group>
                </fieldset>
                <Tabla doubleHeader colors="tabla-toronja"  headers={heading} content={data} />
                {chartData && (
                                    <div style={{
                                        width: '90%',
                                        height: '600px',
                                        margin: '2rem auto'
                                    }}>
                                    <DataChart 
                                        ref={chartRef}
                                        data={chartData}
                                        type={chartType}
                                        title={modoGeneracional ? "Análisis de Titulación por Generación" : "Análisis de Titulación por Periodo"}
                                        onTypeChange={setChartType}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            // ...existing options...
                                        }}
                                    />
                                </div> 
                                )}
            </Flex>
        </div>
    );
};

export default IndiceTitulacion;