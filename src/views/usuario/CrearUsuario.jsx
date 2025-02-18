import {
    Accordion,
    Button,
    Checkbox,
    Container,
    Flex,
    Group,
    List,
    PasswordInput,
    Popover,
    Progress,
    Select,
    Text,
    TextInput
} from "@mantine/core";
import Header from "src/components/header.jsx";
import { useForm } from "@mantine/form";
import { crearUsuario } from "src/routes/api/controllers/adminController";
import { notifications } from "@mantine/notifications";
import { UserCheck, X } from "tabler-icons-react";
import PasswordStrengthMeter from "src/components/PasswordStrengthMeter";
import { useEffect, useState } from "react";
import { asignarPermiso } from "src/routes/api/controllers/permisoController";
import dropDownData from "src/mockup/dropDownData";
import { useNavigate } from "react-router-dom";

const requirements = [
    { re: /[0-9]/, label: 'Incluye 1 número' },
    { re: /[a-z]/, label: 'Includes 1 letra minúscula' },
    { re: /[A-Z]/, label: 'Includes 1 letra mayúscula' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Incluye caracter especial' },
    ];

function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;
    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
        multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

const CrearUsuario = () => {
    const navigate = useNavigate();
    const [popoverOpened, setPopoverOpened] = useState(false);
    // Realizar fetch de las carreras registradas
    const [carreras, setCarreras] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarrerasAll();
        setCarreras(c);
    };

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            first_name: '',
            paternal_surname: '',
            maternal_surname: '',
            gender: '',
            password: '',
            copyPassword: '',
        },
        validate: {
            password: ((value) => strength < 100 ? 'La contraseña no cumple con los requisitos': null),
            copyPassword: ((value, values) => value !== values.password ? 'Las contraseñas deben ser iguales' : null),
        }
    });

    const handleCreate = async(values) => {
        console.log(permisos.length);
        if (!form.validate() || permisos.length === 0) {
            notifications.show({
                message: `El usuario debe tener por lo menos una carrera asignada.`,
                color: 'red',
                icon: <X />,
            });
        } else {
            const res = await crearUsuario(values);
            if (res.status === 201){
                let assigned = false;
                for (let i = 0; i < permisos.length; i++) {
                    const permitsRes = await asignarPermiso(permisos[i], res.data.username);
                    if (permitsRes.status !== 200) {
                        assigned = false;
                        break;
                    } else
                        assigned = true;
                }
                if (assigned) {
                    notifications.show({
                        message: `Enhorabuena, el usuario ${values.username} fue creado con éxito.`,
                        color: 'teal',
                        icon: <UserCheck />,
                    });
                    navigate('/usuarios/lista');
                } else {
                    notifications.show({
                        message: `Lo sentimos. ${res.data[Object.keys(res.data)[0]]}`,
                        color: 'red',
                        icon: <X />,
                    });
                }
            } else {
                notifications.show({
                    message: `Lo sentimos. ${res.data[Object.keys(res.data)[0]]}`,
                    color: 'red',
                    icon: <X />,
                });
            }
        }
    };
    const strength = getStrength(form.getInputProps('password').value);
    const checks = requirements.map((requirement, index) => (
        <PasswordStrengthMeter key={index} label={requirement.label} meets={requirement.re.test(form.getInputProps('password').value)} />
    ));
    useEffect(() => {
        fetchCarreras();

    }, []);
    return (
        <Container style={{
            display: 'flex',
            flexDirection: 'column',
            align: "center",
            justifyContent: "center",
            padding: "2vw"
        }}>
            <Header color="toronja" route="/" section="Usuario" title="Perfil de Usuario" />
            <Group align="flex-start" mt={20} spacing="xl" >
                <Flex direction="column" w="50%">
                    <form onSubmit={form.onSubmit(handleCreate)}>
                        <TextInput id="username" {...form.getInputProps('username')} className="user-info"   withAsterisk label="Nombre de usuario"/>
                        <TextInput id="email" {...form.getInputProps('email')} className="user-info"    withAsterisk label="Correo electrónico"/>
                        <TextInput id="first_name" {...form.getInputProps('first_name')} className="user-info"   withAsterisk label="Nombre"/>
                        <TextInput id="paternal_surname" {...form.getInputProps('paternal_surname')} className="user-info" withAsterisk label="Apellido Paterno"/>
                        <TextInput id="maternal_surname" {...form.getInputProps('maternal_surname')} className="user-info" label="Apellido Materno"/>
                        <Select {...form.getInputProps('gender')}  data={[{value:'H', label:'Hombre'}, {value:'M', label:'Mujer'}, {value:'X', label:'Otro'}]} label="Sexo" withAsterisk />
                        <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
                            <Popover.Target>
                                <div style={{ width: '100%'}} onFocusCapture={() => setPopoverOpened(true)} onBlurCapture={() => setPopoverOpened(false)} >
                                    <PasswordInput  {...form.getInputProps('password')}  w="100%" label="Contraseña nueva" withAsterisk />
                                </div>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Progress color='teal' value={strength} size={5} mb="xs" />
                                <PasswordStrengthMeter label="Incluir al menos 8 caracteres" meets={form.getInputProps('password').value.length > 7} />
                                {checks}
                            </Popover.Dropdown>
                        </Popover>
                        <PasswordInput width={300} maw='100%' {...form.getInputProps('copyPassword')}  w="100%" label="Repita la contraseña nueva" withAsterisk />
                        <Button type="submit" mt={16} id="btn-editar" w="100%" >Crear</Button>
                    </form>
                </Flex>
                <Flex direction="column" className="datos" w="45%">
                            <Text fw="bold">Permisos</Text>
                            <Accordion variant="contained" radius="md" mt={16} w='90%'>
                                <Accordion.Item value="carreras" w="300px" >
                                    <Accordion.Control><b>Carreras</b></Accordion.Control>
                                    <Accordion.Panel>
                                        <List withPadding listStyleType="none">
                                            { carreras.map((carrera,index) =><List.Item key={index}><Checkbox checked={permisos.filter((c) => c === carrera.value).length > 0} label={carrera.label} labelPosition="right" radius="sm" onChange={(e) => {
                                                let copyPermisos = [...permisos];
                                                if (e.target.checked) {
                                                    copyPermisos.push(carrera.value);
                                                    setPermisos(copyPermisos);
                                                } else {
                                                    copyPermisos = copyPermisos.filter((clave) => clave !== carrera.value);
                                                    setPermisos(copyPermisos);
                                                }
                                            }} /></List.Item> )}
                                        </List>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Flex>
            </Group>

        </Container>
    );
};

export default CrearUsuario;