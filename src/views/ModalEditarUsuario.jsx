import {
    Group,
    Modal,
    Button,
    Flex,
    Text,
    TextInput,
    Accordion,
    Checkbox,
    List
} from "@mantine/core";
import { CircleX, DeviceFloppy, Edit, ShieldCheck, X } from "tabler-icons-react";
import { PropTypes } from 'prop-types';
import "./ModalEditarUsuario.css";
import { useEffect, useState } from "react";
import dropDownData from "src/mockup/dropDownData";
import { asignarPermiso, removerTodosPermisos } from "src/routes/api/controllers/permisoController";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { editarUsuario } from "src/routes/api/controllers/adminController";


function ModalEditarUsuario ({opened, close, info}) {
    // Realizar fetch de las carreras registradas
    const form = useForm({
        initialValues: {
            id: 0,
            username:  '',
            email: '',
        }
    });
    const [carreras, setCarreras] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [onEdit, setOnEdit] = useState(false);
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarrerasAll();
        const cA = await dropDownData.getListaCarrerasForUser(info[0]);
        setPermisos(cA.map((carrera) => carrera.value));
        setCarreras(c);
    };

    const enterEditMode = () => {
        setOnEdit(true);
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
                const res = await editarUsuario(values);
                if (res.status !== 200){
                    throw new Error();
                } else {
                    let assigned = false;
                    const removePerm = await removerTodosPermisos(info[0]);
                    if (removePerm.status === 200) {
                        for (let i = 0; i < permisos.length; i++) {
                            const res = await asignarPermiso(permisos[i], info[0]);
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
            } catch (e) {
                notifications.show({
                    message: `Lo sentimos, no se pudieron cambiar los permisos de tu usuario`,
                    color: 'red',
                    icon: <CircleX size={20} />,
                    });
                setOnEdit(false);
            }

        }
    };

    useEffect(() => {
        fetchCarreras();
        setOnEdit(false);
        form.setValues({
            id: info[0],
            username: info[1],
            email: info[2]
        });
    }, [info]);
    return (
        <Modal.Root opened={opened} onClose={close} centered size="xl" closeOnClickOutside={false}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title  fw="bold" ta="center" ml="auto">{ onEdit ? 'Actualizando' : 'Detalles de'} Usuario</Modal.Title>
                    <Modal.CloseButton bg="gris" color="negro"></Modal.CloseButton>
                </Modal.Header>
                <Modal.Body>
                    <form id="editUser" onSubmit={form.onSubmit(updateUser)}>
                    <Flex direction="row" align="flex-start" justify="center" gap={20}>
                        <Flex direction="column" className="datos" w="45%">
                            <Text fw="bold">Datos de usuario</Text>
                            <TextInput label="Id de usuario" {...form.getInputProps('id')} disabled />
                            <TextInput label="Nombre de usuario" {...form.getInputProps('username')} disabled={!onEdit} />
                            <TextInput type="email" label="Correo electrónico"  {...form.getInputProps('email')} disabled={!onEdit} />
                        </Flex>
                        <Flex direction="column" className="datos" w="45%">
                            <Text fw="bold">Permisos</Text>
                            <Accordion variant="contained" radius="md" mt={16} w='90%'>
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
                    </Flex>
                    </form>
                    <Group position='center' align="center" mt={16}>
                        { onEdit ?
                            <Button form="editUser" key="btnSend" leftIcon={<DeviceFloppy />} color="toronja"  type="submit">Actualizar</Button>
                        :
                            <Button leftIcon={<Edit />} key="btnEdit" color="toronja" type="button" onClick={enterEditMode}>Editar</Button>
                        }
                        <Button color="gris" onClick={close}>Cancelar</Button>
                    </Group>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}

ModalEditarUsuario.propTypes = {
    opened: PropTypes.bool,
    info: PropTypes.array,
    close: PropTypes.func,
};

export default ModalEditarUsuario;