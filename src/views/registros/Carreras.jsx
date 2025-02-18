import { Button, Center, Flex, Group, TextInput } from "@mantine/core";
import { Link } from "react-router-dom";
import { Check, CirclePlus, X } from 'tabler-icons-react';
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import './Registro.css';
import { createCarrera, getCarreras } from "src/utils/helpers/carreraHelpers";
import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";


const RegistroCarreras = () => {
    const [carreras, setCarreras] = useState([]);
    const headers = [
        'CLAVE', 'NOMBRE'
    ];

    const obtenerCarreras = async() => {
        const listaCarreras = await getCarreras();
        const listaC = [];
        listaCarreras.forEach((c) => {
            listaC.push([c['clave'], c['nombre']]);
        });
        setCarreras(listaC);
    };


    const form = useForm({
        initialValues: {
            'nombre': '',
            'clave': ''
        }, validate: {
            'clave': ((value) => value === '' ? 'La clave no es válida' : null),
            'nombre': ((value) => value === '' ? 'El nombre no es válido' : null)
        }
    });

    useEffect(() => {
        obtenerCarreras();
    }, []);

    const crearCarrera = async(values) => {
        if (form.validate()){
            const res = await createCarrera(values.clave, values.nombre);
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
        obtenerCarreras();
    };

    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="toronja" section="Registro" title="Carreras" route="/"/>
            <Group align="flex-start" spacing="3vw">
                <Flex direction="column">
                    <form onSubmit={form.onSubmit(crearCarrera)}>
                        <TextInput {...form.getInputProps('nombre')} label="Nombre" withAsterisk/>
                        <TextInput {...form.getInputProps('clave')} label="Clave" withAsterisk/>
                        <Center>
                            <Button mt={16} leftIcon={<CirclePlus />} type='submit' >Crear Carrera</Button>
                        </Center>
                    </form>
                    <Flex direction="column" justify="center" align="center" mt={16} p={10} style={{backgroundColor: '#EBEBEB', borderRadius: '20px'}}>
                        <img style={{width: '5vw'}} src="/img/icons/question-circle-black.svg" alt="Signo de interrogacion" />
                        ¿Necesitas crear un nuevo plan de estudios?
                        <Link to="#"style={{color: "#FF785A"}}>Da clic aquí</Link>
                    </Flex>
                </Flex>
                <Flex direction="column" align="flex-start" justify="flex-start" >
                    <Tabla headers={headers} content={carreras} smallSize colors="tabla-toronja" />
                </Flex>
            </Group>
        </div>
    );
};

export default RegistroCarreras;