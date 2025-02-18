import { Button, Checkbox, Flex, Group, Select, TextInput } from "@mantine/core";
import Header from "src/components/header";
import { DeviceFloppy, Download, Edit, FileExport, Search, X } from "tabler-icons-react";
import dropDownData from "src/mockup/dropDownData";
import Tabla from "src/components/Tabla";
import { useEffect, useState } from "react";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { ordenarRegistros } from "src/utils/helpers/historialHelpers";
import { DateInput } from "@mantine/dates";
import { getAlumnoInfo, updateAlumnoInfo } from "src/routes/api/controllers/alumnoController";
import ModalRespuesta from "src/components/modals/ModalRespuesta";
import { useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { generatePDFReporte } from "../../utils/helpers/export/pdfHelpers";

const AlumnosHistorial = () => {
    const { control } = useParams();
    const [opened, handlers] = useDisclosure(false);
    const [response, setResponse] = useState(false);
    const [editar, setEditar] = useState(false);
    const [buscar, setBuscar] = useInputState('');
    const [alumno, setAlumno] = useState({});
    const [sexo, setSexo] = useState('H');
    const [fechaNac, setFechaNac] = useState('');
    const [lenguaInd, setLenguaInd] = useState(false);
    const [liberacionIng, setLiberacionIng] = useState(false);
    const [registros, setRegistros] = useState([]);
    const headers = [
        'Semestre', 'Periodo', 'Estatus'
    ];

    const handleEdit = () => {
        editar ? setEditar(false) : setEditar(true);
    };

    const handleSearch = async(event) => {
        if(event.key === 'Enter') {
            await searchAlumno('');
        }
    };
    const searchAl = async () => {
        await searchAlumno('');
    };
    const searchAlumno = async (numControl) => {
        let alumnoData = {};
        if (numControl !== '') {
            console.log(numControl);
            alumnoData = await getAlumnoInfo(numControl);
        } else {
            alumnoData = await getAlumnoInfo(buscar);
        }
        if (alumnoData.status === 200) {
            const alumnoInfo = {...alumnoData.data['curp']};
            const fechaNac = new Date(alumnoInfo['fecha_nacimiento']);
            alumnoInfo['fecha_nac'] = fechaNac;
            alumnoInfo['no_control'] = alumnoData.data['no_control'];
            alumnoInfo['estatus'] = alumnoData.data['estatus'];
            alumnoInfo['semestres'] = alumnoData.data['registros']['ingresos'].length.toString();
            alumnoInfo['carrera'] = alumnoData.data['plan']['carrera'];
            setLenguaInd(alumnoInfo['habla_lengua_indigena']);
            alumnoInfo['plan'] = alumnoData.data['plan']['clave'];
            setLiberacionIng(alumnoData.data['registros']['liberacion_ingles'].length > 0 ? true : false);
            setAlumno(alumnoInfo);
            setFechaNac(alumnoInfo['fecha_nac']);
            setSexo(alumnoData.data['curp']['genero']);
            setEditar(false);
            const reg = await ordenarRegistros(alumnoData.data['registros']['ingresos'], alumnoInfo['carrera']);
            setRegistros(reg);
        } else {
            notifications.show({
                message: 'No existe un alumno asociado a esa matrícula.',
                color: 'red',
                icon: <X size={20} />,
              });
        }
    };
    const handlePrint = async() => {
        try {
            const fechaN = fechaNac.toISOString().split('T');
            await generatePDFReporte(alumno, fechaN[0], headers, registros);
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
    const updateAlumno = async() => {
        const alumnoForm = new FormData(document.getElementById('form-alumno'));
        alumnoForm.append('curp', alumno['curp']);
        alumnoForm.append('plan', alumno['plan']);
        const fechaN = new Date(alumnoForm.get('fecha_nacimiento'));
        const fechaNacFormatted = `${fechaN.getFullYear()}-${fechaN.getMonth()+1}-${fechaN.getDate()}`;
        alumnoForm.delete('fecha_nacimiento');
        alumnoForm.delete('habla_lengua_indigena');
        alumnoForm.append('fecha_nacimiento', fechaNacFormatted);
        alumnoForm.append('habla_lengua_indigena', lenguaInd);
        const res = await updateAlumnoInfo(alumnoForm, alumno['curp']);
        setResponse(res);
        handlers.open();
    };

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const copyAlumno = {...alumno};
        copyAlumno[name] = value;
        setAlumno(copyAlumno);
    };
    const initialCheck = async () => {
        if (control) {
            setBuscar(control);
            await searchAlumno(control);
        } else {
            const alumnoInicial = {
                'nombre': '',
                'paterno': '',
                'materno': '',
                'control': '',
                'genero': '',
                'semestres': '1',
                'carrera': '',
            };
            setAlumno(alumnoInicial);
            setRegistros([]);
        }
    };
    useEffect(() => {
        initialCheck();
    },[]);
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Alumnos" title="Historial" route="/alumnos" />
            <Group align="flex-start" spacing="3vw">
                <Flex direction="column">
                    <form id="form-alumno">
                        <Group align='end' mt={10}>
                            <TextInput placeholder="Buscar por matrícula" w='65%' value={buscar} onChange={setBuscar} onKeyUp={handleSearch}  icon={<Search width={20} />} />
                            <Button w='30%' onClick={searchAl}>Buscar</Button>
                        </Group>
                        <TextInput label="Nombre" value={alumno.nombre} name="nombre" onChange={handleInputChange} disabled={!editar} withAsterisk/>
                        <TextInput label="Apellido paterno" name="paterno" onChange={handleInputChange} value={alumno.paterno} disabled={!editar} withAsterisk/>
                        <TextInput label="Apellido materno" name="materno" onChange={handleInputChange} value={alumno.materno} disabled={!editar} withAsterisk/>
                        <TextInput label="No. de control" name="no_control" onChange={handleInputChange}  value={alumno['no_control']} disabled={!editar} withAsterisk/>
                        <Group className="input-group">
                            <Select width="45%" label="Sexo" name="genero" disabled={!editar} onChange={setSexo} placeholder="Seleccionar una opción" data={[{value:'H', label:'Hombre'},{value:'M',label:'Mujer'}]} withAsterisk value={sexo}/>
                            <DateInput label="Fecha de nacimiento" name="fecha_nacimiento" onChange={setFechaNac} disabled={!editar} valueFormat="YYYY-MM-DD" value={fechaNac}  withAsterisk width="45%"/>
                        </Group>
                        <Group className="input-group">
                            <Select
                                width="45%"
                                label="Estatus"
                                readOnly
                                disabled={!editar}
                                placeholder="Seleccionar un estatus"
                                data={[
                                    {value: 'Inscrito', label: 'Inscrito'},
                                    {value: 'Baja', label: 'Baja'},
                                    {value: 'Egresado', label: 'Egresado'},
                                    {value: 'Titulado', label: 'Titulado'},
                                ]}
                                value={alumno.estatus}
                                withAsterisk
                            />
                            <Select
                                width="45%"
                                label="Semestre"
                                disabled={!editar}
                                readOnly
                                placeholder="Seleccione un semestre"
                                data={dropDownData.semestres.map((fila) => ({"value":fila[0], "label":fila[1]}))}
                                value={alumno.semestres}
                                withAsterisk
                            />
                        </Group>
                        <Checkbox labelPosition='left' color='toronja' readOnly checked={liberacionIng} disabled={!editar} mt={15} label='Liberacion de inglés' radius='sm' />
                        <Checkbox labelPosition='left' name="habla_lengua_indigena" onChange={(event) => setLenguaInd(event.currentTarget.checked)} checked={lenguaInd} color='toronja' disabled={!editar} mt={15} label='Habla lengua indígena' radius='sm' />
                        { editar ?
                            <Group className="input-group">
                                <Button type="button" mt={16} leftIcon={<DeviceFloppy />} onClick={updateAlumno}>Guardar</Button>
                                <Button type="button" mt={16} color="gris" onClick={handleEdit} >Cancelar</Button>
                                <Button type="button" mt={16} color="naranja" leftIcon={<FileExport />} >Exportar</Button>
                            </Group>
                        :
                            <Group className="input-group">
                                <Button type="button" mt={16} leftIcon={<Edit />} onClick={handleEdit}>Editar</Button>
                                <Button type="button" mt={16} color="naranja" onClick={handlePrint} leftIcon={<FileExport />} >Exportar</Button>
                            </Group>
                        }
                    </form>
                </Flex>
                <Flex direction="column" align="flex-start" justify="flex-start" >
                    <Tabla headers={headers} smallSize content={registros} colors="tabla-toronja" />
                </Flex>
            </Group>
            <ModalRespuesta opened={opened} close={handlers.close} success={response}/>
        </div>
    );
};

export default AlumnosHistorial;