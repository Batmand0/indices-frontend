import { Button, Checkbox, Flex, Group, Loader } from "@mantine/core";
import Header from "src/components/header";
import Dropdown from "src/components/Dropdown";
import Tabla from "src/components/Tabla";
import dropDownData from "src/mockup/dropDownData";
import { useInputState } from "@mantine/hooks";
import { useEffect, useState, useRef } from "react";
import { getCrecimientoHeaders } from "src/utils/helpers/headerHelpers";
import { Download, Printer, X } from "tabler-icons-react";
import { generatePDF } from "src/utils/helpers/export/pdfHelpers";
import { generateExcel } from "src/utils/helpers/export/excelHelpers";
import { getTablasCrecimiento } from "src/routes/api/controllers/tablasController";
import { buildTablaCrecimiento } from "src/utils/helpers/tablasHelpers";
import { notifications } from "@mantine/notifications";
import DataChart from 'src/components/charts/DataChart';


const TablaCrecimiento = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [heading, setHeading] = useState([]);
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [chartType, setChartType] = useState('bar'); 
    const chartRef = useRef(null);

    const handleTable = async() => {
        setIsLoading(true);
        const header = getCrecimientoHeaders(cohorte, numSemestres);
        const table = await getTablasCrecimiento(examenYConv, trasladoYEquiv, cohorte, numSemestres, carrera);
        
        if (table.status === 200) {
            const tab = buildTablaCrecimiento(table.data);
            setData(tab);
            setHeading(header);
            setChartData(prepareChartData(tab, header));
        } else {
            setHeading([]);
            setData([]);
            setChartData(null);
            notifications.show({
                message: 'Lo sentimos, hubo un problema al obtener los datos',
                color: 'red',
                icon: <X />,
            });
        }
        setIsLoading(false);
    };

    const handlePrint = async() => {
        const tipoAlumno = (examenYConv && trasladoYEquiv) ? 1 : examenYConv ? 2 : 3;
        try {
            if (exportar === 'PDF') {
                await generatePDF('Crecimiento', cohorte, numSemestres, heading, data, false, examenYConv, trasladoYEquiv, carrera !== 'TODAS' ? carrera : 'Crecimiento general', chartRef);
            } else if (exportar === 'Excel') {
                 await generateExcel(heading, data, 'Crecimiento', cohorte, numSemestres, tipoAlumno);
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
    // Cohorte, carrera y numSemestres son los datos de los Select
    const [cohorte, setCohorte] = useInputState('');
    const [carrera, setCarrera] = useInputState('');
    const [numSemestres, setNumSemestre] = useInputState(0);
    const [exportar, setExportar] = useInputState('');
    const [examenYConv, setExamenYConv] = useState(true);
    const [trasladoYEquiv, setTrasladoYEquiv] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarreras();
        c.push({'value': 'TODAS', 'label': 'TODAS LAS CARRERAS'});
        setCarreras(c);
    };

    useEffect(() => {
        fetchCarreras();
    }, []);

    
    const prepareChartData = (tableData, headers) => {
        // Extraer periodos y poblaciones
        const periodos = tableData.map((row) => row[0]); // Primera columna son los periodos
        const poblaciones = tableData.map((row) => row[1]); // Segunda columna son las poblaciones

        // Crear un solo dataset ya que es una sola línea de crecimiento
        const datasets = [{
            label: 'Población Estudiantil',
            data: poblaciones,
            backgroundColor: 'rgba(255, 170, 90, 0.5)', // Color naranja
            borderColor: 'rgb(255, 170, 90)',
            borderWidth: 2,
            tension: 0.3 // Hace la línea un poco más suave
        }];

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
            <Header align="center" justify="center" color="naranja" section="Tablas" title="Crecimiento" route="/tablas" />
            <Flex align="center" justify="center" direction="column">
                <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group position="center" mt={0} mb={16} color='gris'>
                        { carreras.length > 0 ? <Dropdown  label="Programa educativo" color="#FFAA5A" handleChangeFn={setCarrera} data={carreras} /> : null }
                        <Dropdown  label="Cohorte generacional" color="#FFAA5A" handleChangeFn={setCohorte} data={dropDownData.getCohortes()} />
                        <Dropdown  label="Cálculo de semestres" color="#FFAA5A" handleChangeFn={setNumSemestre} data={dropDownData.numSemestres} />
                        <Dropdown  label="Exportar" color="#FFAA5A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>
                    <Group position="center" mt={0} mb={16} >
                        <Checkbox labelPosition='left' checked={examenYConv} color="naranja" onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox labelPosition='left' checked={trasladoYEquiv} color="naranja" onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end" }} >
                        <Button  disabled={!cohorte || !numSemestres || !exportar || !(examenYConv || trasladoYEquiv) || data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='toronja'>Imprimir</Button>
                        <Button  disabled={(!cohorte || !numSemestres || !(examenYConv || trasladoYEquiv)) && !isLoading} onClick={handleTable} color='negro'>{isLoading ? <Loader size='sm' color='#FFFFFF'/>  : "Filtrar"}</Button>
                    </Group>
                </fieldset>
                <Tabla headers={heading} content={data} colors="tabla-naranja" />
                
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
                            title={`Crecimiento Estudiantil - Cohorte ${cohorte} ${carrera !== 'TODAS' ? `- ${carrera}` : ''}`}
                            onTypeChange={setChartType}
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
                                                return `Población: ${context.raw}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Población Estudiantil'
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

export default TablaCrecimiento;