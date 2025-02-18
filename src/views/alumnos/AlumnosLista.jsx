import "src/views/indices/Indices.css";
import { Button, Checkbox, Flex, Group, Loader, Pagination } from "@mantine/core";
import Header from "src/components/header";
import Dropdown from "src/components/Dropdown";
import Tabla from "src/components/Tabla";
import dropDownData from "src/mockup/dropDownData";
import { useInputState } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { getListaAlumnosHeaders } from "src/utils/helpers/headerHelpers";

import { Download, Printer, X } from "tabler-icons-react";
import { getAllAlumnosHistorial, getFullHistorial } from "src/routes/api/controllers/alumnoController";
import { generatePDF } from "src/utils/helpers/export/pdfHelpers";
import { generateExcel } from "src/utils/helpers/export/excelHelpers";
import { buildListaAlumnos } from "src/utils/helpers/alumnoHelpers";
import { notifications } from "@mantine/notifications";


const AlumnosLista = () => {
    const mounted = useRef(false);
    // Heading y data almacenan la informacion de los encabezados y el contenido de la tabla, respectivamente
    const [heading, setHeading] = useState([[], []]);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState('');
    const [fullTable, setFullTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tableCount, setTableCount] = useState(0);
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
        setCarreras(c);
    };
    useEffect(() => {
        fetchCarreras();
    }, []);
    const handleTable = async() => {
        setIsLoading(true);
        const res = await getAllAlumnosHistorial(examenYConv, trasladoYEquiv,cohorte, numSemestres, carrera, page, page > 1 ? nextPage: '/alumnos/historial');
        if (res.status === 200) {
            setNextPage(res.data['next']);
            const headers = getListaAlumnosHeaders(cohorte, numSemestres);
            setTableCount(res.data['count']);
            setHeading(headers);
            try {
                const tabla = buildListaAlumnos(res.data['results'],numSemestres, cohorte);
                if (tabla.length > 0) {
                    setData(tabla);
                    getFullTable();
                } else {
                    throw new Error();
                }
            } catch (err) {
                setHeading([[],[]]);
                setData([]);
                setNextPage('');
                setTableCount(0);
                notifications.show({
                    message: 'Lo sentimos, no pudimos encontrar los datos que solicitó. Intente con una busqueda diferente.',
                    color: 'red',
                    icon: <X />,
                  });
            }
        } else {
            setHeading([[],[]]);
            setData([]);
            setNextPage('');
            setTableCount(0);
            notifications.show({
                message: 'Lo sentimos, hubo un problema al obtener los datos',
                color: 'red',
                icon: <X />,
              });
        }
        setIsLoading(false);
    };

    const getFullTable = async() => {
        const res = await getFullHistorial(examenYConv, trasladoYEquiv,cohorte, numSemestres, carrera);
        setFullTable(res);
    };

    useEffect(() => {
        if (mounted.current) {
            if (fullTable.length < 1){
                if (page > 1)
                    handleTable();
            } else {
                setData(fullTable[page-1]);
            }
        } else {
            mounted.current = true;
        }
    }, [page]);

    const handlePrint = async() => {
        const megaTable = [];
        fullTable.forEach((page) => page.forEach((row) => megaTable.push(row)));
        if (exportar === 'PDF') {
            generatePDF('Lista de Alumnos', cohorte, numSemestres, heading, megaTable, true, examenYConv, trasladoYEquiv, carrera);
        } else if (exportar === 'Excel') {
            await generateExcel(heading, megaTable, 'Lista de Alumnos', cohorte, numSemestres, 0, carrera);
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
            <Header color="naranja" section="Alumnos" title="Lista" route="/alumnos" />
            <Flex direction="column">
                <fieldset className='filtros'>
                    <legend>Filtros</legend>
                    <Group mt={0} mb={16} color='gris'>
                        { carreras.length > 0 ? <Dropdown  label="Programa educativo" color="#FFAA5A" handleChangeFn={setCarrera} data={carreras} /> : null }
                        <Dropdown  label="Cohorte generacional" color="#FFAA5A" handleChangeFn={setCohorte} data={dropDownData.getCohortes()} />
                        <Dropdown  label="Cálculo de semestres" color="#FFAA5A" handleChangeFn={setNumSemestre} data={dropDownData.numSemestres} />
                        <Dropdown  label="Exportar" color="#FFAA5A" handleChangeFn={setExportar} data={[
                            {'value':'Excel','label':'Excel'},
                            {'value':'PDF','label':'PDF'},
                        ]} />
                    </Group>
                    <Group mt={0} mb={16} >
                        <Checkbox labelPosition='left' color='naranja'  checked={examenYConv} onChange={(event) => setExamenYConv(event.currentTarget.checked)} label='Examen y Convalidación' radius='sm' />
                        <Checkbox labelPosition='left' color='naranja'  checked={trasladoYEquiv} onChange={(event) => setTrasladoYEquiv(event.currentTarget.checked)} label='Traslado y Equivalencia' radius='sm' />
                    </Group>
                    <Group style={{ justifyContent: "flex-end"}} >
                        <Button  disabled={!cohorte || !numSemestres || !exportar || data.length === 0} onClick={handlePrint} leftIcon={<Printer />} color='toronja'>Imprimir</Button>
                        <Button onClick={handleTable} disabled={!cohorte || !carrera || !numSemestres || isLoading} color="negro">{isLoading ? <Loader size="sm" color="#FFFFFF" /> : "Filtrar"}</Button>
                    </Group>
                </fieldset>
                <Tabla colors="tabla-naranja" doubleHeader headers={heading} content={data} />
                <p>{tableCount > 0 ? `Mostrando ${page !== 1 ? ((page-1)*30)+1 : 1} - ${(page*30) > tableCount ? tableCount : (page)*30} de ${tableCount}`: null}</p>
                <Pagination color="naranja" mt={20} value={page} onChange={setPage} total={Math.ceil(tableCount/30)}/>
            </Flex>
        </div>
    );

};
export default AlumnosLista;