import { Button, Checkbox, Flex, Group, Loader, Menu, UnstyledButton, Text } from "@mantine/core";
import Header from "src/components/header";
import Dropdown from "src/components/Dropdown";
import Tabla from "src/components/Tabla";
import { useInputState } from "@mantine/hooks";
import dropDownData from "src/mockup/dropDownData";
import { getTablasHeaders } from "src/utils/helpers/headerHelpers";
import { useState, useRef } from "react";
import { Download, Printer, X, Filter } from "tabler-icons-react";
import { buildTable } from "src/utils/helpers/tablasHelpers";
import { generatePDF } from "src/utils/helpers/export/pdfHelpers";
import { generateExcel } from "src/utils/helpers/export/excelHelpers";
import { getTablasPoblacion } from "src/routes/api/controllers/tablasController";
import { notifications } from "@mantine/notifications";
import DataChart from 'src/components/charts/DataChart';


const TablaPoblacion = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [heading, setHeading] = useState([]);
    const [data, setData] = useState([]);
    // Cohorte, carrera y numSemestres son los datos de los Select
    const [cohorte, setCohorte] = useInputState('');
    const [numSemestres, setNumSemestre] = useInputState(0);
    const [exportar, setExportar] = useInputState('');
    const [examenYConv, setExamenYConv] = useState(true);
    const [trasladoYEquiv, setTrasladoYEquiv] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [chartType, setChartType] = useState('bar'); // bar chart es mejor para comparar poblaciones
    const chartRef = useRef(null);
    const [selectedCarreras, setSelectedCarreras] = useState([]);
    const [availableCarreras, setAvailableCarreras] = useState([]);


    const handleTable = async() => {
        setIsLoading(true);
        const tabla = await getTable();
        const header = getTablasHeaders(cohorte, numSemestres);
        setHeading(header);
        setData(tabla);
        setChartData(prepareChartData(tabla, header, selectedCarreras));
        setIsLoading(false);
    };

    const getTable = async() => {
        const tabla = await getTablasPoblacion(examenYConv, trasladoYEquiv, cohorte, numSemestres);
        if (tabla.status === 200) {
            const table = await buildTable(tabla.data);
            return table;
        } else {
            setHeading([]);
            setData([[]]);
            notifications.show({
                message: 'Lo sentimos, hubo un problema al obtener los datos',
                color: 'red',
                icon: <X />,
              });
              return [];
        }

    };

    const handlePrint = async() => {
        const tipoAlumno = (examenYConv && trasladoYEquiv) ? 1 : examenYConv ? 2 : 3;
        try {
            if (exportar === 'PDF') {
                await generatePDF('Poblacion', cohorte, numSemestres, heading, data, false, examenYConv, trasladoYEquiv, "", chartRef);
            } else if (exportar === 'Excel') {
                 await generateExcel(heading, data, 'Poblacion', cohorte, numSemestres, tipoAlumno);
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

    const prepareChartData = (tableData, headers, selected) => {
        const periodos = headers.slice(2);
        const carrerasMap = new Map();
        
        // Actualizar carreras disponibles solo la primera vez
        if (availableCarreras.length === 0) {
            // Paso 1: Toma cada fila y obtiene el nombre de la carrera (primera columna)
            // Ejemplo: ['ISC', 'IEM', 'II', ...]
            const carreras = tableData.map((row) => row[0])
                // Paso 2: Filtra las carreras que no son 'Total'
                .filter((carrera) => carrera !== 'Total')
                // Paso 3: Convierte cada nombre en un objeto con value y label
                // Ejemplo: [{value: 'ISC', label: 'ISC'}, {value: 'IEM', label: 'IEM'}]
                .map((carrera) => ({ value: carrera, label: carrera }));

            setAvailableCarreras(carreras);// Guarda todas las carreras
            setSelectedCarreras([]); // Iniciar sin carreras seleccionadas
        }
        
        // Procesar solo las carreras seleccionadas
        tableData.forEach((row) => {
            const carrera = row[0]; // Toma el nombre de la carrera
            // Si la carrera está seleccionada y no es el total
            if (selected.includes(carrera) && carrera !== 'Total') {
                // Guarda los datos numéricos de la carrera
                // row.slice(2) toma todos los datos después de la segunda columna
                carrerasMap.set(carrera, row.slice(2).map((val) => parseInt(val) || 0));
            }
        });

        // Convertir el mapa a datasets para Chart.js
        const datasets = Array.from(carrerasMap.entries()).map(([carrera, datos]) => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);

            return {
                label: carrera,
                data: datos,
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                borderColor: `rgb(${r}, ${g}, ${b})`,
                borderWidth: 1
            };
        });

        return {
            labels: periodos,
            datasets: datasets
        };
    };

    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>  
            <Header align="center" justify="center" color="toronja" section="Tablas" title="Población" route="/tablas" />
                <Flex align="center" justify="center" direction="column" style={{ width: '100%' }}>
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
                            <Checkbox labelPosition='left' checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                            <Checkbox labelPosition='left' checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                        </Group>
                        <Group position="center" style={{ justifyContent: "flex-end" }} >
                            <Button  disabled={!cohorte || !numSemestres || !exportar || !(examenYConv || trasladoYEquiv)|| data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='naranja'>Imprimir</Button>
                            <Button  disabled={(!cohorte || !numSemestres || !(examenYConv || trasladoYEquiv)) && !isLoading} onClick={handleTable} color='negro'>{isLoading ? <Loader size='sm' color='#FFFFFF'/>  : "Filtrar"}</Button>
                        </Group>
                    </fieldset>
                    <Tabla headers={heading} content={data} colors="tabla-toronja" />

                    {chartData && (
                        <div style={{
                            width: '90%',
                            height: '600px',
                            margin: '2rem auto'
                        }}>
                            <Flex align="center" justify="flex-end" mb={20}>
                                <Menu shadow="md" width={200}>
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
                                                onClick={() => {
                                                    // Si la carrera ya está seleccionada
                                                    const newSelected = selectedCarreras.includes(carrera.value)
                                                        ? selectedCarreras.filter((c) => c !== carrera.value) // La quita
                                                        : [...selectedCarreras, carrera.value];              // La agrega
                                                    // Actualiza el estado de las carreras seleccionadas
                                                    setSelectedCarreras(newSelected);
                                                    // Usar el nuevo array directamente
                                                    setChartData(prepareChartData(data, heading, newSelected));
                                                }}
                                            >
                                                <Flex align="center" gap={8}>
                                                    {selectedCarreras.includes(carrera.value) ? '✓' : ' '}
                                                    <Text>{carrera.label}</Text>
                                                </Flex>
                                            </Menu.Item>
                                        ))}
                                    </Menu.Dropdown>
                                </Menu>
                            </Flex>
                            
                            <DataChart 
                                ref={chartRef}
                                data={chartData}
                                type={chartType}
                                title={`Población Estudiantil por Carrera - Cohorte ${cohorte}`}
                                onTypeChange={setChartType}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    return `${context.dataset.label}: ${context.raw} estudiantes`;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: 'Número de Estudiantes'
                                            }
                                        },
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Periodo'
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


export default TablaPoblacion;