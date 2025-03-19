import { Button, Checkbox, Flex, Group, Loader } from '@mantine/core';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import Dropdown from 'src/components/Dropdown';
import { useEffect, useState } from 'react';
import { useInputState } from '@mantine/hooks';
import dropDownData from 'src/mockup/dropDownData';
import { getIndicesHeaders } from 'src/utils/helpers/headerHelpers';
import { Download, Printer, X } from 'tabler-icons-react';
import { buildTablaIndices, buildTablaIndicesGeneracional } from 'src/utils/helpers/indicesHelpers';
import { getIndicesData, getIndicesDataGeneracional } from 'src/routes/api/controllers/indicesController';
import { generatePDF } from 'src/utils/helpers/export/pdfHelpers';
import { generateExcel } from 'src/utils/helpers/export/excelHelpers';
import { notifications } from '@mantine/notifications';

const IndiceDesercion = () => {
    // Estado para controlar el loading mientras se cargan datos
    const [isLoading, setIsLoading] = useState(false);
    
    // Estados para la estructura de la tabla
    // heading: almacena los encabezados en formato [[fila1], [fila2]]
    // data: almacena el contenido de la tabla
    const [heading, setHeading] = useState([[],[]]);
    const [data, setData] = useState([]);
    
    // Estados para los filtros del formulario
    const [cohorte, setCohorte] = useInputState(''); // Año de ingreso
    const [carrera, setCarrera] = useInputState(''); // Programa educativo seleccionado
    const [numSemestres, setNumSemestre] = useInputState(0); // Número de semestres a calcular
    const [exportar, setExportar] = useInputState(''); // Formato de exportación (PDF/Excel)
    
    // Estados para tipos de alumnos a incluir
    const [examenYConv, setExamenYConv] = useState(true); // Alumnos por examen y convalidación
    const [trasladoYEquiv, setTrasladoYEquiv] = useState(false); // Alumnos por traslado y equivalencia
    
    // Nuevo estado para modo generacional
    const [modoGeneracional, setModoGeneracional] = useState(false);

    // Lista de carreras disponibles
    const [carreras, setCarreras] = useState([]);

    // Función para obtener la lista de carreras del backend
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarreras();
        c.push({'value': 'TODAS', 'label': 'TODAS LAS CARRERAS'}); // Añade opción para todas las carreras
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

    // Manejador para generar la tabla con los datos filtrados
    const handleTable = async() => {
        setIsLoading(true);
        try {
            if (modoGeneracional) {
                // Nueva lógica para modo generacional
                const tabla = await getIndicesDataGeneracional('desercion', {
                    examenYConv,
                    trasladoYEquiv,
                    cohorteInicial: cohorte,
                    carrera,
                    numSemestres
                });

                if (tabla.status === 200) {
                    // Headers para vista generacional
                    const headers = [
                        [`Deserción a ${numSemestres} semestres por Generación`],
                        ['Generación', 'Total Inicial', 'Total Actual', 'Tasa Deserción']
                    ];
                    setHeading(headers);
                    const datos = buildTablaIndicesGeneracional('desercion', tabla.data);
                    setData(datos);
                } else {
                    throw new Error('Error al obtener datos generacionales');
                }
            } else {
                // Lógica existente para modo normal
                const tabla = await getIndicesData('desercion', examenYConv, trasladoYEquiv, cohorte, carrera, numSemestres);
                
                if (tabla.status === 200) {
                    const headers = await getIndicesHeaders(2, cohorte, carrera);
                    setHeading(headers);
                    const datos = buildTablaIndices('desercion', tabla.data, numSemestres);
                    setData(datos);
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

    // Manejador para exportar la tabla en PDF o Excel
    const handlePrint = async() => {
        // Determina el tipo de alumno según las casillas seleccionadas
        const tipoAlumno = examenYConv && trasladoYEquiv ? 1 : examenYConv ? 2 : 3;
        try {
            // Exporta según el formato seleccionado
            if (exportar === 'PDF') {
                await generatePDF('Deserción', cohorte, numSemestres, heading, data, false, examenYConv, trasladoYEquiv, carrera);
            } else if (exportar === 'Excel') {
                await generateExcel(heading, data, 'Indice Desercion', cohorte, numSemestres, tipoAlumno);
            }
            // Notificación de éxito
            notifications.show({
                message: 'La descarga de tu documento ha comenzado.',
                color: 'teal',
                icon: <Download size={20} />,
            });
        } catch (e) {
            // Manejo de errores en la exportación
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
            <Header 
                color="naranja" 
                section="Indices" 
                title={`Deserción ${modoGeneracional ? 'Generacional' : 'por cohorte generacional'}`}  
                route="/indices" 
            />
            <Flex align="center" justify="center" direction="column">
                <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group position="center" mt={0} mb={16} color='gris'>
                        { carreras.length > 0 ? 
                            <Dropdown  
                                label="Programa educativo" 
                                color="#FFAA5A" 
                                handleChangeFn={setCarrera} 
                                data={carreras} 
                            /> : null 
                        }
                        <Dropdown  
                            label={modoGeneracional ? "Cohorte inicial" : "Cohorte generacional"} 
                            color="#FFAA5A" 
                            handleChangeFn={setCohorte} 
                            data={dropDownData.getCohortes()} 
                        />
                        <Dropdown  
                            label="Cálculo de semestres" 
                            color="#FFAA5A" 
                            handleChangeFn={setNumSemestre} 
                            data={dropDownData.numSemestres} 
                        />
                        <Dropdown  label="Exportar" color="#FFAA5A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>

                    <Group position="center" mt={0} mb={16} >
                        <Checkbox labelPosition='left' color='naranja'  checked={modoGeneracional} onChange={(event) => setModoGeneracional(event.currentTarget.checked)} label='Modo Generacional' radius='sm' />
                        <Checkbox labelPosition='left' color='naranja'  checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox labelPosition='left' color='naranja'  checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end" }} >
                        <Button  disabled={!cohorte || !numSemestres || !exportar || !(examenYConv || trasladoYEquiv) || data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='toronja'>Imprimir</Button>
                        <Button onClick={handleTable} color='negro' disabled={(!cohorte || !carrera || !numSemestres || !(examenYConv || trasladoYEquiv)) && !isLoading} >{isLoading ? <Loader size='sm' color='#FFFFFF'/>  : "Filtrar"}</Button>
                    </Group>
                </fieldset>
                <Tabla doubleHeader colors="tabla-naranja"  headers={heading} content={data} />
            </Flex>
        </div>
    );
};

export default IndiceDesercion;