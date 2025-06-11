import { Button, Checkbox, Flex, Group, Loader, Menu, UnstyledButton, Text } from '@mantine/core';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import Dropdown from 'src/components/Dropdown';
import {  useState, useRef } from 'react';
import { useInputState } from '@mantine/hooks';
import dropDownData from 'src/mockup/dropDownData';
import "src/views/indices/Indices.css";
import { getReportesHeaders } from 'src/utils/helpers/headerHelpers';
import { generatePDF } from 'src/utils/helpers/export/pdfHelpers';
import { Download, Filter, Printer, X } from 'tabler-icons-react';
import { generateExcel } from 'src/utils/helpers/export/excelHelpers';
import { getReportesEgresoTitulacion } from 'src/routes/api/controllers/reportesController';
import { buildTablaReportesEgreso } from '../../utils/helpers/reportesHelpers';
import { notifications } from '@mantine/notifications';
import DataChart from 'src/components/charts/DataChart';

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
    const [chartData, setChartData] = useState(null);
    const [chartType] = useState('line'); // line chart es mejor para ver eficiencia
    const chartRef = useRef(null);

    // Variables para manejar los filtros de carrera
    const [selectedCarreras, setSelectedCarreras] = useState([]);
    const [availableCarreras, setAvailableCarreras] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);

    const handleTable = async() => {
        setIsLoading(true);
        const tabla = await getReportesEgresoTitulacion('egreso', examenYConv, trasladoYEquiv, cohorte, numSemestres);
        if (tabla.status === 200) {
            try {
                const headers = await getReportesHeaders(2, cohorte, numSemestres);
                setHeading(headers);
                const reporte = buildTablaReportesEgreso(tabla.data);
                setData(reporte);
                setOriginalData(reporte);

                // Obtener todas las carreras disponibles
                const carreras = reporte
                    .filter((row) => row[0] !== 'Total')
                    .map((row) => ({
                        value: row[0],
                        label: row[0],
                        isTotal: false
                    }));

                setAvailableCarreras(carreras);
                // Seleccionar todas las carreras por defecto
                const allCarreras = carreras.map((c) => c.value);
                setSelectedCarreras(allCarreras);
                
                // Actualizar la gráfica con todas las carreras
                setChartData(prepareChartData(reporte, headers, allCarreras));
                setShowFilters(true);
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

    const prepareChartData = (tableData, numSemestres) => {
    
        // La eficiencia está en la última columna de cada fila
        const datasets = [];
        const eficiencias = tableData.map((row) => ({
            carrera: row[0],
            eficiencia: parseFloat(row[row.length - 1]) || 0
        }));
        const eficiencias2 = tableData.map((row) => ({
            carrera: row[0],
            eficiencia: parseFloat(row[row.length - 4]) || 0
        }));
        if(numSemestres > 12){
            datasets.push({
                label: 'Eficiencia de Egreso a 12 semestres',
                data: eficiencias2.map((e) => e.eficiencia),
                backgroundColor: 'rgba(255, 120, 90, 0.5)', // Color toronja
                borderColor: 'rgb(255, 120, 90)',
                borderWidth: 2
            });

            // La eficiencia de egreso es la última columna de la tabla
            datasets.push({
                label: `Eficiencia de Egreso a ${numSemestres} semestres`,
                data: eficiencias.map((e) => e.eficiencia),
                backgroundColor: 'rgba(90, 120, 255, 0.5)', // Color azul
                borderColor: 'rgb(90, 120, 255)',
                borderWidth: 2
            });
        } else{
            // La eficiencia de egreso es la ultima columna de la tabla
            datasets.push({
                label: 'Eficiencia de Egreso',
                data: eficiencias.map((e) => e.eficiencia),
                backgroundColor: 'rgba(255, 120, 90, 0.5)', // Color toronja
                borderColor: 'rgb(255, 120, 90)',
                borderWidth: 2
            });
        }
        
    
        return {
            labels: eficiencias.map((e) => e.carrera),
            datasets: datasets
        };
    };

    const handleCarreraSelection = (carrera) => {
        const newSelected = selectedCarreras.includes(carrera.value)
            ? selectedCarreras.filter((c) => c !== carrera.value)
            : [...selectedCarreras, carrera.value];
        
        setSelectedCarreras(newSelected);
        
        const filteredData = newSelected.length === 0
            ? originalData
            : originalData.filter((row) => 
                newSelected.includes(row[0]) || (row[0] === 'Total' && newSelected.includes('Total'))
            );
        
        setData(filteredData);
        setChartData(prepareChartData(filteredData, newSelected));
    };

    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Reportes" title="Egreso" route="/reportes" />
            <Flex align="center" justify="center" direction="column">
                <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group position="center" mt={0} mb={16} color='gris'>
                        <Dropdown  label="Cohorte generacional" color="#FF785A" handleChangeFn={setCohorte} data={dropDownData.getCohortes()} />
                        <Dropdown  label="Cálculo de semestres" color="#FF785A" handleChangeFn={setNumSemestre} data={dropDownData.numSemestres} />
                        <Dropdown  label="Exportar" color="#FF785A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>
                    <Group position="center" mt={0} mb={16} >
                        <Checkbox labelPosition='left' color='toronja' checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox labelPosition='left' color='toronja' checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end" }} >
                        <Button  disabled={!cohorte || !numSemestres || !exportar || !(examenYConv || trasladoYEquiv) || data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='naranja'>Imprimir</Button>
                        <Button onClick={handleTable} disabled={(!cohorte || !numSemestres || !(examenYConv || trasladoYEquiv)) && !isLoading} color='negro'>{isLoading ? <Loader size='sm'  color='#FFFFFF' /> : 'Filtrar'}</Button>
                    </Group>
                </fieldset>
                {showFilters && (
                    <Flex align="end" justify="flex-end" mb={20} gap={10}>
                        <Menu 
                            shadow="md" 
                            width={200}
                            opened={menuOpened}
                            onChange={setMenuOpened}
                            closeOnItemClick={false}
                        >
                            <Menu.Target>
                                <UnstyledButton 
                                    sx={(theme) => ({
                                        padding: '8px 12px',
                                        borderRadius: theme.radius.sm,
                                        color: theme.colors.gray[7],
                                        '&:hover': {
                                            backgroundColor: theme.colors.gray[0],
                                        },
                                    })}
                                >
                                    <Flex align="center" gap={8}>
                                        <Filter size={16} />
                                        <Text size="sm">Filtrar Carreras</Text>
                                    </Flex>
                                </UnstyledButton>
                            </Menu.Target>
                
                            <Menu.Dropdown>
                                {availableCarreras.map((carrera) => (
                                    <Menu.Item 
                                        key={carrera.value}
                                        onClick={() => handleCarreraSelection(carrera)}
                                    >
                                        <Flex align="center" gap={8}>
                                            {selectedCarreras.includes(carrera.value) ? '✓' : ' '}
                                            <Text>{carrera.label}</Text>
                                        </Flex>
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                        <Button 
                            variant="subtle" 
                            size="sm"
                            onClick={() => {
                                const allCarreras = availableCarreras.map((c) => c.value);
                                setSelectedCarreras(allCarreras);
                                setData(originalData);
                                setChartData(prepareChartData(originalData, allCarreras));
                            }}
                            mr={10}
                        >
                            Limpiar filtros
                        </Button>
                    </Flex>
                )}
                <Tabla colors="tabla-toronja" tripleHeader  headers={heading} content={data} />
                
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
                            title={`Eficiencia de Egreso - Cohorte ${cohorte}`}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return `${context.dataset.label}: ${context.raw}%`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Porcentaje de Eficiencia'
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Carrera'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </Flex>
        </div>
    );
};

export default ReportesEgreso;