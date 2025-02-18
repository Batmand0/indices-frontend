import "./navbar.css";
import { ChevronDown, Home, Search, UserCircle, X } from "tabler-icons-react";
import {
    Header,
    Menu,
    Button,
    Group,
    TextInput,
    ActionIcon,
    Burger,
    createStyles,
    Text,
    SimpleGrid,
    UnstyledButton,
    Divider,
    Tooltip
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import ModalLogout from './modals/ModalLogout';
import { getAlumnoInfo } from "../routes/api/controllers/alumnoController";
import { notifications } from '@mantine/notifications';
import ModalCorte from "./modals/ModalCorte";
import { useAuthStore } from "src/store/auth";

const useStyles = createStyles((theme) => ({
    burger: {
        [theme.fn.largerThan(1340)]: {
          display: 'none',
        },
        marginLeft: '50%',
      },

    menus: {
    [theme.fn.smallerThan(1340)]: {
        display: 'none',
    },
    },
    mobileMenu: {
        [theme.fn.largerThan(1340)]: {
            display: 'none',
        },
        width: '60vw',
        maxWidth: 650,
        height: 'auto',
    },
    subLink: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: theme.radius.md,

        ...theme.fn.hover({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        }),

        '&:active': theme.activeStyles,
    },
    spanMenu: {
        [theme.fn.smallerThan(1340)]: {
            display: 'none',
        },
    },
    searchBar: {
        [theme.fn.smallerThan(1340)]: {
            input: {
                '&::placeholder': {
                    color: theme.white,
                    },

                display: 'none',
            },
            icon: {
                color: theme.white,
            }
        },
    }

}));
const NavBar = () => {
    const user = useAuthStore((state) => state.user);
    const { classes } = useStyles();
    const [buscar, setBuscar] = useInputState('');
    const [opened, {open, close}] = useDisclosure(false);
    const [isOpen, handlers] = useDisclosure(false);

    const navigate = useNavigate();
    const handleMiPerfil = () => {
      navigate('mi-perfil');
    };

    const [opend, { toggle }] = useDisclosure(false);

    const handleSearch = async(event) => {
        if(event.key === 'Enter') {
            await searchAlumno();
        }
    };

    const searchAlumno = async () => {
        const alumnoData = await getAlumnoInfo(buscar);
        if (alumnoData.status === 200) {
            navigate(`/alumnos/historial/${buscar}`);
        } else {
            notifications.show({
                message: 'No existe un alumno asociado a esa matrícula.',
                color: 'red',
                icon: <X size={20} />,
              });
        }
    };
    return (
        <Header bg="negro" height={40}>
            <div className="nav">
                <Group>
                    <Button color="negro" leftIcon={<Home />} uppercase={true} onClick={()=> {
                        navigate('/');
                    }}>
                        <span className={classes.spanMenu}>Inicio</span>
                    </Button>
                    <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="Escribe la matrícula de un estudiante para ver su historial">
                        <TextInput placeholder="BUSCAR" icon={<Search />} value={buscar} onChange={setBuscar} onKeyUp={handleSearch} className={classes.searchBar}  size="xs"/>
                    </Tooltip>
                </Group>

                <Group>
                    {/* Menu de tablas */}
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target className={classes.menus}>
                            <Button color="negro" uppercase={true}>
                                Tablas
                                <ChevronDown size={16} strokeWidth={2} color={'white'} />
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={() => {
                                navigate('/tablas/poblacion');
                            }}>POBLACION</Menu.Item>
                            <Menu.Item onClick={() => {
                                navigate('/tablas/crecimiento');
                            }}>CRECIMIENTO</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {/* Menu de indices */}
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target className={classes.menus}>
                            <Button color="negro">
                                INDICES
                                <ChevronDown size={16} strokeWidth={2} color={'white'} />
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={() => {
                                navigate('/indices/permanencia');
                            }}>PERMANENCIA</Menu.Item>
                            <Menu.Item onClick={() => {
                                navigate('/indices/egreso');
                            }}>EGRESO</Menu.Item>
                            <Menu.Item onClick={() => {
                                navigate('/indices/titulacion');
                            }}>TITULACION</Menu.Item>
                            <Menu.Item onClick={() => {
                                navigate('/indices/desercion');
                            }}>DESERCION</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {/* Menu de reportes */}
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target className={classes.menus}>
                            <Button color="negro">
                                REPORTES
                                <ChevronDown size={16} strokeWidth={2} color={'white'} />
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={() => {
                                navigate('/reportes/nuevo-ingreso');
                            }}>NUEVO INGRESO</Menu.Item>
                            <Menu.Item onClick={() => {
                                navigate('/reportes/egreso');
                            }}>EGRESADOS</Menu.Item>
                            <Menu.Item onClick={() => {
                                navigate('/reportes/titulacion');
                            }}>TITULADOS</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {/* Menu de cedulas */}
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target className={classes.menus}>
                            <Button color="negro">
                                CEDULAS
                                <ChevronDown size={16} strokeWidth={2} color={'white'} />
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={()=>{
                                navigate('/cedulas/caceca');
                                }}>CACECA</Menu.Item>
                            <Menu.Item onClick={()=>{
                                navigate('/cedulas/cacei');
                                }}>CACEI</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {/* Menu de alumnos */}
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target className={classes.menus}>
                            <Button color="negro">
                                ALUMNOS
                                <ChevronDown size={16} strokeWidth={2} color={'white'} />
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={()=>{
                                navigate('/alumnos/historial');
                                }}>HISTORIAL POR ALUMNO</Menu.Item>
                            <Menu.Item onClick={()=>{
                                navigate('/alumnos/lista');
                                }}>LISTA DE ALUMNOS</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    <Button color="negro" className={classes.menus} onClick={()=>{
                                navigate('/subir-archivos');
                                }} >SUBIR ARCHIVOS</Button>

                    {/* Menu de registros */}
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target className={classes.menus}>
                            <Button color="negro">
                                REGISTROS
                                <ChevronDown size={16} strokeWidth={2} color={'white'} />
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown className={classes.menus}>
                            <Menu.Item onClick={()=>{
                                navigate('/registro/carrera');
                                }}>CARRERAS</Menu.Item>
                            <Menu.Item onClick={()=>{
                                navigate('/registro/planes');
                                }}>PLANES DE ESTUDIO</Menu.Item>
                            <Menu.Item onClick={()=>{
                                navigate('/registro/discapacidades');
                                }}>DISCAPACIDADES</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
                {/* Menu movil */}
                <Menu trigger="click" opened={opend} onChange={toggle} openDelay={100} closeDelay={400} position="right" >
                    <Menu.Target>
                        <Burger
                            opened={opend}
                            onClick={toggle}
                            className={classes.burger}
                            size="sm"
                            color="#fff"
                        />
                    </Menu.Target>

                    <Menu.Dropdown mt={45} >
                        <Group position="apart" px="md"  className={classes.mobileMenu} >
                            <Group mt={10}>
                                <Text fw={700}>Menu</Text>
                                <Divider my="md" mt={0} mb={0} className="menuDiv"/>
                            </Group>
                            <SimpleGrid  breakpoints={[
                                {maxWidth: 600, cols: 1},
                                {maxWidth: 750, cols: 2},
                                {maxWidth: 1350, cols: 3},
                            ]}>
                                <UnstyledButton variant="unstyled" className={classes.subLink} onClick={() => {
                                navigate('/tablas');
                            }}>
                                    <Group noWrap align="center">
                                        <div className="menu-movil-icon">
                                            <img src="/img/tablas.svg" alt="Icono Tablas" />
                                        </div>
                                        <Text fw={600}>Tablas</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton variant="unstyled" className={classes.subLink} onClick={() => {
                                navigate('/indices');
                            }}>
                                    <Group noWrap align="center">
                                        <div className="menu-movil-icon">
                                            <img src="/img/indices.svg" alt="Icono Tablas" />
                                        </div>
                                        <Text fw={600}>Indices</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton variant="unstyled" className={classes.subLink} onClick={() => {
                                navigate('/reportes');
                            }}>
                                    <Group noWrap align="center">
                                        <div className="menu-movil-icon">
                                            <img src="/img/reportes.svg" alt="Icono Tablas" />
                                        </div>
                                        <Text fw={600}>Reportes</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton variant="unstyled" className={classes.subLink} onClick={() => {
                                navigate('/cedulas');
                            }}>
                                    <Group noWrap align="center">
                                        <div className="menu-movil-icon">
                                            <img src="/img/cedulas.svg" alt="Icono Tablas" />
                                        </div>
                                        <Text fw={600}>Cédulas</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton variant="unstyled" className={classes.subLink} onClick={() => {
                                navigate('/alumnos');
                            }}>
                                    <Group noWrap align="center">
                                        <div className="menu-movil-icon">
                                            <img src="/img/alumnos.svg" alt="Icono Tablas" />
                                        </div>
                                        <Text fw={600}>Alumnos</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton variant="unstyled" className={classes.subLink} onClick={() => {
                                navigate('/subir-archivos');
                            }}>
                                    <Group noWrap align="center">
                                        <div className="menu-movil-icon">
                                            <img src="/img/subir-archivos.svg" alt="Icono Subir Archivos" />
                                        </div>
                                        <Text fw={600}>Subir Archivos</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton variant="unstyled" className={classes.subLink} onClick={() => {
                                navigate('/registro');
                            }}>
                                    <Group noWrap align="center">
                                        <div className="menu-movil-icon">
                                            <img src="/img/registros.svg" alt="Icono Registros" />
                                        </div>
                                        <Text fw={600}>Registros</Text>
                                    </Group>
                                </UnstyledButton>
                            </SimpleGrid>
                        </Group>
                    </Menu.Dropdown>
                </Menu>


                {/* Menu de usuario */}
                <Menu trigger="hover" openDelay={100} closeDelay={400}>
                    <Menu.Target>
                        <ActionIcon variant="filled" color="negro" mr={10}>
                            <UserCircle />
                        </ActionIcon>
                    </Menu.Target>

                    { !user().is_superuser ?
                        <Menu.Dropdown>
                            <Menu.Item onClick={handleMiPerfil}>MI PERFIL</Menu.Item>
                            <Menu.Item onClick={()=>{
                                    navigate('/cambio-contrasena');
                                    }}>CAMBIO DE CONTRASEÑA</Menu.Item>
                            <Menu.Item onClick={open} >CERRAR SESION</Menu.Item>
                        </Menu.Dropdown> :
                    <Menu.Dropdown>
                        <Menu.Item onClick={handleMiPerfil}>MI PERFIL</Menu.Item>
                        <Menu.Item onClick={()=>{
                            navigate('/usuarios/lista');
                            }}>LISTA DE USUARIOS</Menu.Item>
                        <Menu.Item onClick={handlers.open} >REALIZAR CORTE</Menu.Item>
                        <Menu.Item onClick={()=>{
                                navigate('/cambio-contrasena');
                                }}>CAMBIO DE CONTRASEÑA</Menu.Item>
                        <Menu.Item onClick={open} >CERRAR SESION</Menu.Item>
                    </Menu.Dropdown> }
                </Menu>
            </div>
            <ModalLogout opened={opened} close={close} />
            <ModalCorte opened={isOpen} close={handlers.close} />
        </Header>
    );
};

export default NavBar;