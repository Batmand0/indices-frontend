import { Button, Checkbox, Flex, Group, Loader } from "@mantine/core";
import Header from "src/components/header";
import Dropdown from "src/components/Dropdown";
import Tabla from "src/components/Tabla";
import { useInputState } from "@mantine/hooks";
import dropDownData from "src/mockup/dropDownData";
import { getTablasHeaders } from "src/utils/helpers/headerHelpers";
import { useState, useRef } from "react";
import { Download, Printer, X } from "tabler-icons-react";
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


    const handleTable = async() => {
        setIsLoading(true);
        const tabla = await getTable();
        const header = getTablasHeaders(cohorte, numSemestres);
        setHeading(header);
        setData(tabla);
        setChartData(prepareChartData(tabla, header));
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

    const prepareChartData = (tableData, headers) => {
        // Log para ver la estructura completa de los headers
        console.log('Headers completos:', headers);
        
        // Obtener periodos de los headers (empezando desde el índice 2)
        const periodos = headers.slice(2);  // Esto tomará desde "2015-1" hasta el final
        console.log('Periodos extraídos:', periodos);
        
        // Crear un mapa de carreras y sus datos
        const carrerasMap = new Map();
        
        // Procesar los datos por carrera
        tableData.forEach((row) => {
            const carrera = row[0]; // Primera columna es el nombre de la carrera
            if (!carrerasMap.has(carrera)) {
                // Tomamos los datos desde el segundo elemento
                carrerasMap.set(carrera, row.slice(2).map((val) => parseInt(val) || 0));
            }
        });

        // Convertir el mapa a arrays para Chart.js
        const carreras = Array.from(carrerasMap.keys());
        const datasets = carreras.map((carrera) => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);

            return {
                label: carrera,
                data: carrerasMap.get(carrera),
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                borderColor: `rgb(${r}, ${g}, ${b})`,
                borderWidth: 1,
            };
        });

        return {
            labels: periodos,  // Ahora usamos los periodos correctos
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
                            <DataChart 
                                ref={chartRef}
                                data={chartData}
                                type={chartType}
                                title={`Población Estudiantil por Carrera - Cohorte ${cohorte}`}
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


export default TablaPoblacion;