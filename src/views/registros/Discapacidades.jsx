import { Button, Center, Flex, Group, TextInput, Textarea } from "@mantine/core";
import { Check, CirclePlus, X } from 'tabler-icons-react';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import './Registro.css';
import { useEffect, useState } from "react";
import { createDiscapacidad, getDiscapacidades } from "src/routes/api/controllers/discapacidadController";
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';


const RegistroDiscapacidades = () => {
    const headers = [
        'NOMBRE', 'DESCRIPCION'
    ];
    const [discapacidades, setDiscapacidades] = useState([]);

    const obtenerDiscapacidades = async() => {
        const listaDisc = await getDiscapacidades();
        const listaD = [];
        listaDisc.forEach((p) => {
            listaD.push([p.nombre, p.descripcion]);
        });
        setDiscapacidades(listaD);
    };
    const form = useForm({
        initialValues: {
            'nombre': '',
            'deescripcion': '',

        }, validate: {
            'clave': ((value) => value === '' ? 'La clave no es válida' : null),
            'descripcion': ((value) => value === '' ? 'La descripción no es válida' : null)
        }
    });
    const crearDiscapacidad = async(values) => {
        if (form.validate()){
            const res = await createDiscapacidad(values.nombre, values.descripcion);
            if (res.status === 201){
                notifications.show({
                    message: 'El registro fue creado con éxito.',
                    color: 'teal',
                    icon: <Check size={20} />,
                  });
            } else {
                notifications.show({
                    message: 'Lo sentimos, hubo un problema al crear el registro',
                    color: 'red',
                    icon: <X />,
                });
            }
            form.reset();
        }
        obtenerDiscapacidades();
    };
    useEffect(() => {
        obtenerDiscapacidades();
    }, []);
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Registro" title="Discapacidades" route="/"/>
            <Group align="flex-start" spacing="3vw">
                <Flex direction="column" className="col-input">
                    <form onSubmit={form.onSubmit(crearDiscapacidad)}>
                        <TextInput {...form.getInputProps('nombre')} label="Nombre" withAsterisk/>
                        <Textarea withAsterisk  {...form.getInputProps('descripcion')} label="Descripción" autosize/>
                        <Center>
                            <Button type="submit" mt={16} leftIcon={<CirclePlus />} >Agregar Discapacidad</Button>
                        </Center>
                    </form>
                </Flex>
                <Flex direction="column" align="flex-start" justify="flex-start" w="50%" maw='40vw' >
                    <Tabla headers={headers} smallSize content={discapacidades} colors="tabla-toronja" />
                </Flex>
            </Group>
        </div>
    );
};

export default RegistroDiscapacidades;