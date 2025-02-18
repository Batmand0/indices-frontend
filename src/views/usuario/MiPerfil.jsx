import {
    Accordion,
    Button,
    Checkbox,
    List,
    Flex,
    Group,
    TextInput
} from "@mantine/core";
import { CircleX, DeviceFloppy, Edit, ShieldCheck, X } from "tabler-icons-react";
import Header from "src/components/header.jsx";
import { useAuthStore } from "src/store/auth";
import { useEffect, useState } from "react";
import dropDownData from "src/mockup/dropDownData";
import { asignarPermiso, removerTodosPermisos } from "src/routes/api/controllers/permisoController";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { editarUsuario, getUsuarioById } from "src/routes/api/controllers/adminController";


const MiPerfil = () => {
    const user = useAuthStore((state) => state.user);
    const [onEdit, setOnEdit] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const form = useForm({
        initialValues: {
            username: '',
            email: '',
        }
    });
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarrerasAll();
        const cA = await dropDownData.getListaCarrerasForUser(user().user_id);
        setPermisos(cA.map((carrera) => carrera.value));
        setCarreras(c);
    };

    const fetchUserData = async() => {
        const u = await getUsuarioById(user().user_id);
        if (u.status === 200) {
            console.log(u.data);
            form.setValues({
                username:  u.data.username,
                email: u.data.email,
            });
        }
    };
    const updateUser = async(values) => {
        if (!form.validate() || permisos.length === 0) {
            notifications.show({
                message: `El usuario debe tener por lo menos una carrera asignada.`,
                color: 'red',
                icon: <X />,
            });
        } else {
            try {
                const res = await editarUsuario({id: user().user_id, username: values.username, email: values.email});
                if (res.status !== 200){
                    throw new Error();
                } else {
                    let assigned = false;
                    const removePerm = await removerTodosPermisos(user().user_id);
                    if (removePerm.status === 200) {
                        for (let i = 0; i < permisos.length; i++) {
                            const res = await asignarPermiso(permisos[i], user().user_id);
                            if (res.status !== 200) {
                                assigned = false;
                                break;
                            } else
                                assigned = true;
                        }
                        if (assigned) {
                            notifications.show({
                                message: `Se han cambiado los permisos del usuario "${values.username}" con éxito.`,
                                color: 'teal',
                                icon: <ShieldCheck size={20} />,
                            });
                        } else {
                            throw new Error();
                        }
                    } else {
                        throw new Error();
                    }
                }
            } catch (err) {
                notifications.show({
                    message: `Lo sentimos, no se pudo cambiar la información del usuario`,
                    color: 'red',
                    icon: <CircleX size={20} />,
                    });
            }
        }
    };

    useEffect(() => {
        fetchCarreras();
        // fetchUserData();
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [onEdit]);

    const activateEdit = () => {
        setOnEdit(true);
    };

    const cancelEdit = () => {
        setOnEdit(false);
    };


    return (
        <div style={{
            align: "left",
            padding: "2vw"
        }}>
            <Header color="toronja" route="/" section="Usuario" title="Perfil de Usuario" />
            <Group align="flex-start" mt={20} spacing="xl" >
                <Flex direction="column" w='350px'>
                    <form onSubmit={form.onSubmit(updateUser)}>
                        <TextInput disabled={!onEdit} id="username" className="user-info" {...form.getInputProps('username')} withAsterisk label="Nombre de usuario"/>
                        <TextInput id="email" className="user-info" {...form.getInputProps('email')} disabled={!onEdit} withAsterisk label="Correo electrónico"/>
                        <TextInput id="first_name" className="user-info" value={user().first_name} disabled withAsterisk label="Nombre"/>
                        <TextInput id="paternal_surname" className="user-info" value={user().paternal_surname} disabled withAsterisk label="Apellido Paterno"/>
                        <TextInput id="maternal_surname" className="user-info" value={user().maternal_surname} disabled  label="Apellido Materno"/>
                        <TextInput id="gender" className="user-info" value={user().gender} disabled  label="Sexo"/>
                        { !onEdit ?
                            <Button leftIcon={<Edit />} type="button"  mt={16} id="btn-editar" w="100%" onClick={activateEdit}>Editar</Button>
                        :
                            <Flex direction="column" id="btns" wrap="wrap" justify="center" align="center">
                                <Button leftIcon={<DeviceFloppy />} w="100%" id="btn-actualizar" mt={16} type="submit">Actualizar</Button>
                                <Button mt={16} color="gris" w="100%" onClick={cancelEdit} id="btn-cancelar">Cancelar</Button>
                            </Flex>
                        }
                    </form>
                </Flex>
                <Flex direction="column" align="center" justify="flex-start" >
                    <Accordion variant="contained" radius="md" mt={16}>
                        <Accordion.Item value="carreras" w="300px" >
                            <Accordion.Control><b>Carreras</b></Accordion.Control>
                            <Accordion.Panel>
                                <List withPadding listStyleType="none">
                                    { carreras.map((carrera,index) =><List.Item key={index}><Checkbox disabled={!onEdit} checked={permisos.filter((c) => c === carrera.value).length > 0} label={carrera.label} labelPosition="right" radius="sm" onChange={(e) => {
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
        </div>
    );
};

export default MiPerfil;