import {
    Container,
    Button,
    Title,
    Text,
    Group,
    FileButton,
    Flex,
    ActionIcon,
    Center,
    LoadingOverlay
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { ArrowLeft, Download, FileUpload, Upload, X } from "tabler-icons-react";
import { useDisclosure } from '@mantine/hooks';
import ResultadosLog from 'src/components/modals/resultadosLog';
import { subirArchivosExcel } from 'src/routes/api/controllers/archivosController';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SubirArchivos.css';
import { notifications } from '@mantine/notifications';

const SubirArchivos = () => {
    const [opened, handlers] = useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState({'errors':[], 'created':0});
    const subirArchivos = async (file, tipo) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file[0], file[0].name);
        const res = await subirArchivosExcel(formData, tipo);
        if (res.status !== 400) {
            setInfo(res.data);
            handlers.open();
        } else {
            notifications.show({
                message: 'Lo sentimos, hubo un problema al subir el archivo',
                color: 'red',
                icon: <X />,
            });
        }
        setIsLoading(false);
    };


    return (
        <Container>
            <ActionIcon color='naranja' variant='filled' radius='lg' mt={16} mb={16}>
                <ArrowLeft />
            </ActionIcon>
            <Title order={3}>Subir Archivos</Title>
            <p>Aqui se suben los tres archivos que utiliza el sistema para trabajar, estos deberan ser cargados una vez por semestre.<br />Los archivos deben de seguir el siguiente formato para ser aceptados en el sistema.</p>
            <Group position='center'>
                <LoadingOverlay visible={isLoading} />
                <div>
                    {/* Alumnos inscritos en el semestre */}
                    <Dropzone accept="MS_EXCEL_MIME_TYPE" onDrop={(file) => {
                        subirArchivos(file, 'ingresos');
                    }
                    }>
                        <Flex align="center" direction="column" position="center" gap="xl">
                            <Text fw={700} tt="capitalize">Alumnos Inscritos</Text>
                            {/* Es un icono */}
                            <FileUpload  size={72} color="#FFAA5A"/>
                            <FileButton color='naranja'>
                                {(props) => <Button color="naranja" leftIcon={<Upload />}>Subir Archivos</Button>}
                            </FileButton>
                        </Flex>
                    </Dropzone>
                    <Link style={{ textDecoration: 'none'}} to="/documents/plantillas/excel/Plantilla_Lista_Alumnos.xlsx" target="_blank" download >
                        <Button rightIcon={<Download />} styles="textDecoration: none;" variant='light' color='gris' fullWidth mt="10px">Descargar Plantilla</Button>
                    </Link>
                </div>

                <div>
                    {/* Alumnos egresados */}
                    <Dropzone accept="MS_EXCEL_MIME_TYPE" onDrop={(file) => {
                        subirArchivos(file, 'egresos');
                    }}>
                        <Flex align="center" direction="column" position="center" gap="xl">
                            <Text fw={700} tt="capitalize">Egresados</Text>
                            {/* Es un icono */}
                            <FileUpload  size={72} color="#FFAA5A"/>
                            <FileButton color='naranja'>
                                {(props) => <Button color="naranja" leftIcon={<Upload />}>Subir Archivos</Button>}
                            </FileButton>
                        </Flex>

                    </Dropzone>
                    <Link style={{ textDecoration: 'none'}} to="/documents/plantillas/excel/Plantilla_Lista_Egresados.xlsx" target="_blank" download >
                        <Button rightIcon={<Download />} styles="textDecoration: none;" variant='light' color='gris' fullWidth mt="10px">Descargar Plantilla</Button>
                    </Link>
                </div>

                <div>
                    {/* Alumnos titulados */}
                    <Dropzone accept="MS_EXCEL_MIME_TYPE" onDrop={(file) => {
                        subirArchivos(file, 'titulaciones');
                    }}>
                        <Flex align="center" direction="column" position="center" gap="xl">
                            <Text fw={700} tt="capitalize">Titulados</Text>
                            {/* Es un icono */}
                            <FileUpload  size={72} color="#FFAA5A"/>
                            <FileButton color='naranja'>
                                {(props) => <Button color="naranja" leftIcon={<Upload />}>Subir Archivos</Button>}
                            </FileButton>
                        </Flex>

                    </Dropzone>
                    <Link style={{ textDecoration: 'none'}} to="/documents/plantillas/excel/Plantilla_Lista_Titulados.xlsx" target="_blank" download >
                        <Button rightIcon={<Download />} styles="textDecoration: none;" variant='light' color='gris' fullWidth mt="10px">Descargar Plantilla</Button>
                    </Link>
                </div>

                <div>
                    {/* Liberación de ingles */}
                    <Dropzone accept="MS_EXCEL_MIME_TYPE" onDrop={(file) => {
                    subirArchivos(file, 'liberaciones-ingles');
                    }}>
                        <Flex align="center" direction="column" position="center" gap="xl">
                            <Text fw={700} tt="capitalize">Liberación de ingles</Text>
                            {/* Es un icono */}
                            <FileUpload  size={72} color="#FFAA5A"/>
                            <FileButton color='naranja'>
                                {(props) => <Button color="naranja" leftIcon={<Upload />}>Subir Archivos</Button>}
                            </FileButton>
                        </Flex>
                    </Dropzone>
                    <Link style={{ textDecoration: 'none'}} to="/documents/plantillas/excel/Plantilla_Lista_LiberacionIngles.xlsx" target="_blank" download >
                        <Button rightIcon={<Download />} styles="textDecoration: none;" variant='light' color='gris' fullWidth mt="10px">Descargar Plantilla</Button>
                    </Link>
                </div>
                <ResultadosLog opened={opened} close={handlers.close} info={info}/>
            </Group>
            <Center mt="sm">
                <Link style={{ textDecoration: 'none'}} to="/documents/plantillas/pdf/Manual de usuario.pdf" target="_blank" download >
                    <Button rightIcon={<Download />}  variant='filled' color='negro'  mt="10px">Descargar Manual</Button>
                </Link>
            </Center>
        </Container>
    );
};

export default SubirArchivos;