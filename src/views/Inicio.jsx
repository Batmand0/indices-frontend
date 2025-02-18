import "./Inicio.css";
import { Button, Center, Container, Group, Title } from "@mantine/core";
import { useAuthStore } from "src/store/auth";
import { toTitle } from "src/utils/helpers";
import { Upload } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";


const Principal = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const toSubirArchivos = () => {
        navigate('/subir-archivos');
    };
    return (
        <Container style={{
            maxWidth: '100vw',
            'padding': '0'
        }}>
            <Group position="center">
                <img className="logos" src="/img/logo/Logo-TecNM.png" alt="Logo del TecNM" />
                <img  className="logos" src="/img/logo/sep_logo.png" alt="Logo de la secretaria de educacion" />
            </Group>
            <Title order={2} mb={ 16 } align="center">Bienvenido, {toTitle(user().first_name)}</Title>
            <Group position="center" align="center" style={{width: '100vw'}}>
                <div className="block" onClick={() => {
                                navigate('/tablas');
                            }}>
                    <h3>Tablas</h3>
                    <img src="/img/tablas.svg" alt="Icono Tablas" />
                </div>

                <div className="block" onClick={() => {
                                navigate('/indices');
                            }}>
                    <h3>Indices</h3>
                    <img src="/img/indices.svg" alt="Icono Indices" />
                </div>

                <div className="block" onClick={() => {
                                navigate('/reportes');
                            }}>
                    <h3 color="toronja">Reportes</h3>
                    <img src="/img/reportes.svg" alt="Icono Reportes" />
                </div>

                <div className="block" onClick={() => {
                                navigate('/cedulas');
                            }}>
                    <h3>Cédulas</h3>
                    <img src="/img/cedulas.svg" alt="Icono Cedulas" />
                </div>

                <div className="block" onClick={() => {
                                navigate('/alumnos');
                            }}>
                    <h3>Alumnos</h3>
                    <img src="/img/alumnos.svg" alt="Icono Alumnos" />
                </div>
            </Group>
            <Center>
                <Button mt={ 32 } color="naranja" leftIcon={<Upload />} onClick={toSubirArchivos}>
                    Subir archivos
                </Button>
            </Center>
        </Container>
    );
};

export default Principal;