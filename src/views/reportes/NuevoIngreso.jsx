import { Button, Checkbox, Flex, Group, Loader } from '@mantine/core';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import Dropdown from 'src/components/Dropdown';
import {  useState, useRef} from 'react';
import { useInputState } from '@mantine/hooks';
import dropDownData from 'src/mockup/dropDownData';
import "src/views/indices/Indices.css";
import { getNuevoIngresoHeaders } from 'src/utils/helpers/headerHelpers';
import { generatePDF } from 'src/utils/helpers/export/pdfHelpers';
import { Download, Printer, X } from 'tabler-icons-react';
import { generateExcel } from 'src/utils/helpers/export/excelHelpers';
import { getReportesNuevoIngreso } from 'src/routes/api/controllers/reportesController';
import { notifications } from '@mantine/notifications';
import { buildTablaReportesNuevoIngreso } from 'src/utils/helpers/reportesHelpers';
import { Menu, UnstyledButton, Text } from '@mantine/core';
import { Filter } from 'tabler-icons-react';
import DataChart from 'src/components/charts/DataChart';

const ReportesNuevoIngreso = () => {
    // Heading y data almacenan la informacion de los encabezados y el contenido de la tabla, respectivamente
    const [data, setData] = useState([]);
    const [heading, setHeading] = useState([[], [], []]);
    const [isLoading, setIsLoading] = useState(false);
    // Cohorte, carrera y numSemestres son los datos de los Select
    const [cohorte, setCohorte] = useInputState('');
    // const [carrera, setCarrera] = useInputState('');
    const [numSemestres, setNumSemestre] = useInputState(0);
    const [exportar, setExportar] = useInputState('');
    const [examenYConv, setExamenYConv] = useState(true);
    const [trasladoYEquiv, setTrasladoYEquiv] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [chartType] = useState('bar');
    const chartRef = useRef(null);
    const [selectedCarreras, setSelectedCarreras] = useState([]);
    const [availableCarreras, setAvailableCarreras] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);
    const [showByGender, setShowByGender] = useState(false);

    const handleTable = async() => {
        setIsLoading(true);
        const tabla = await getReportesNuevoIngreso(examenYConv, trasladoYEquiv, cohorte, numSemestres);
        if (tabla.status === 200) {
            try {
                const header = await getNuevoIngresoHeaders(cohorte, numSemestres);
                setHeading(header);
                const reporte = buildTablaReportesNuevoIngreso(tabla.data);
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
                
                // Agregar opción de Total
                carreras.push({
                    value: 'Total',
                    label: 'Total',
                    isTotal: true
                });
                
                setAvailableCarreras(carreras);
                // Seleccionar todas las carreras por defecto
                const allCarreras = carreras.map((c) => c.value);
                setSelectedCarreras(allCarreras);
                
                // Actualizar la gráfica con todas las carreras
                setChartData(prepareChartData(reporte, header, allCarreras));
                setShowFilters(true);
                
            } catch (error) {
                setHeading([[], [], []]);
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
                await generatePDF('Nuevo Ingreso', cohorte, numSemestres, heading, data, false, examenYConv, trasladoYEquiv);
            } else if (exportar === 'Excel') {
                await generateExcel(heading, data, 'Nuevo Ingreso', cohorte, numSemestres, tipoAlumno);
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

    const prepareChartData = (tableData, headers, selected, showGender) => {
        // Extraer periodos únicos
        const periodos = new Set();
        headers[0].forEach((header, index) => {
            if (index > 0) {
                const periodo = header.replace(" (H)", "").replace(" (M)", "");
                periodos.add(periodo);
            }
        });

        const carrerasMap = new Map();

        // Procesar las carreras seleccionadas
        tableData.forEach((row) => {
            const carrera = row[0];
            if (selected.includes(carrera)) {
                const datosHombres = [];
                const datosMujeres = [];
                
                for (let i = 1; i < row.length; i += 2) {
                    datosHombres.push(parseInt(row[i]) || 0);
                    datosMujeres.push(parseInt(row[i + 1]) || 0);
                }
                
                carrerasMap.set(carrera, {
                    hombres: datosHombres,
                    mujeres: datosMujeres,
                    total: datosHombres.map((h, idx) => h + datosMujeres[idx])
                });
            }
        });

        // Convertir el mapa a datasets
        const datasets = [];
        Array.from(carrerasMap.entries()).forEach(([carrera, datos]) => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);

            if (showGender) {
                // Dataset para hombres y mujeres separados
                datasets.push({
                    label: `${carrera} (H)`,
                    data: datos.hombres,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                    borderColor: `rgb(${r}, ${g}, ${b})`,
                    borderWidth: 1
                });

                datasets.push({
                    label: `${carrera} (M)`,
                    data: datos.mujeres,
                    backgroundColor: `rgba(${b}, ${r}, ${g}, 0.5)`,
                    borderColor: `rgb(${b}, ${r}, ${g})`,
                    borderWidth: 1
                });
            } else {
                // Dataset combinado
                datasets.push({
                    label: carrera,
                    data: datos.total,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                    borderColor: `rgb(${r}, ${g}, ${b})`,
                    borderWidth: 1
                });
            }
        });

        return {
            labels: Array.from(periodos),
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
        setChartData(prepareChartData(filteredData, heading, newSelected));
    };

    const handleGenderView = () => {
        const newShowByGender = !showByGender;
        setShowByGender(newShowByGender);
    
        // Usar newShowByGender en lugar de showByGender
        setChartData(prepareChartData(data, heading, selectedCarreras, newShowByGender));
    };

    return(
        <div style={{ width: '100vw', padding: '3vw' }}>
            <Header color="naranja" section="Reportes" title="Nuevo Ingreso" route="/reportes" />
            <Flex align="center" justify="center" direction="column">
                <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group position="center" mt={0} mb={16} color='gris'>
                        <Dropdown  label="Cohorte generacional" color="#FFAA5A" handleChangeFn={setCohorte} data={dropDownData.getCohortes()} />
                        <Dropdown  label="Cálculo de semestres" color="#FFAA5A" handleChangeFn={setNumSemestre} data={dropDownData.numSemestres} />
                        <Dropdown  label="Exportar" color="#FFAA5A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>
                    <Group position="center" mt={0} mb={16} >
                        <Checkbox color='naranja' labelPosition='left' checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox color='naranja'  labelPosition='left' checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end" }} >
                        <Button  disabled={!cohorte || !numSemestres || !exportar || !(examenYConv || trasladoYEquiv) || data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='toronja'>Imprimir</Button>
                        <Button onClick={handleTable} disabled={(!cohorte || !numSemestres || !(examenYConv || trasladoYEquiv)) && !isLoading} color='negro'>{isLoading ? <Loader size='sm' color='#FFFFFF'/>  : "Filtrar"}</Button>
                    </Group>
                </fieldset>
                {showFilters && (
                    <Flex align="end" justify="flex-end" mb={20} gap={10}>
                        <Button 
                            variant="subtle" 
                            size="sm"
                            onClick={handleGenderView}
                        >
                            {showByGender ? 'Ver Total' : 'Ver por Género'}
                        </Button>
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
                                setChartData(prepareChartData(originalData, heading, allCarreras));
                            }}
                            mr={10}
                        >
                            Limpiar filtros
                        </Button>
                    </Flex>
                )}
                <Tabla colors="tabla-naranja" doubleHeader headers={heading} content={data} />
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
                            title={`Nuevo Ingreso ${showByGender ? 'por Género' : ''} - Cohorte ${cohorte}`}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            // Personalizar las etiquetas de la leyenda
                                            generateLabels: (chart) => {
                                                const labels = DataChart.defaults.plugins.legend.labels.generateLabels(chart);
                                                return labels.map((label) => ({
                                                    ...label,
                                                    text: label.text // Puedes personalizar el texto aquí si lo necesitas
                                                }));
                                            }
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                const label = context.dataset.label;
                                                const value = context.raw;
                                                return `${label}: ${value} estudiantes`;
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

export default ReportesNuevoIngreso;