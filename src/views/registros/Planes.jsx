import { Button, Center, Flex, Group, Select, TextInput } from "@mantine/core";
import { Check, CirclePlus, X } from 'tabler-icons-react';
import { DateInput } from "@mantine/dates";
import Header from 'src/components/header';
import Tabla from 'src/components/Tabla';
import './Registro.css';
import { createPlan, getPlanes } from "src/utils/helpers/planesHelper";
import { useEffect, useState } from "react";
import dropDownData from "../../mockup/dropDownData";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const RegistroPlanes = () => {
    const [carreras, setCarreras] = useState([]);
    const [planes, setPlanes] = useState([]);
    const fetchCarreras = async() => {
        const c = await dropDownData.getListaCarreras();
        setCarreras(c);
    };

    const headers = [
        'CLAVE', 'FECHA DE INICIO', 'FECHA DE TERMINACION', 'CARRERA'
    ];
    const obtenerPlanes = async() => {
        const listaPlanes = await getPlanes();
        const listaP = [];
        listaPlanes.forEach((p) => {
            listaP.push([p.clave, p['fecha_inicio'], p['fecha_final'], p['carrera']['nombre']]);
        });
        setPlanes(listaP);
    };

    useEffect(() => {
        obtenerPlanes();
        fetchCarreras();
    }, []);

    const form = useForm({
        initialValues: {
            'clave': '',
            'fechaInicio': null,
            'fechaFinal': null,
            'carrera': '',
        }, validate: {
            'clave': ((value) => value === '' ? 'La clave no es válida' : null)
        }
    });

    const crearPlan = async(values) => {
        if (form.validate()){
            const fechaInicio = values.fechaInicio.toISOString().split('T');
            let fechaFin = [null, null];
            if (values.fechaFinal !== null) {
                fechaFin = values.fechaFinal.toISOString().split('T');
            }
            const res = await createPlan(values.clave, fechaInicio[0], fechaFin[0], values.carrera);
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
        obtenerPlanes();
    };
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Header color="naranja" section="Registro" title="Planes de Estudio" route="/"/>
            <Group align="flex-start" spacing="3vw">
                <Flex direction="column" >
                    <form onSubmit={form.onSubmit(crearPlan)}>
                        <TextInput label="Clave" {...form.getInputProps('clave')} withAsterisk/>
                        <Group className="input-group">
                            <DateInput label="Fecha de inicio" valueFormat="YYYY-MM-DD" {...form.getInputProps('fechaInicio')} width="45%" withAsterisk/>
                            <DateInput label="Fecha de terminación" valueFormat="YYYY-MM-DD" {...form.getInputProps('fechaFinal')} width="45%" />
                        </Group>
                        { carreras.length > 0 ? <Select width="100%" label="Carrera" {...form.getInputProps('carrera')} placeholder="Seleccione una carrera" data={carreras} withAsterisk/> : null }
                        <Center>
                            <Button type="submit" mt={16} leftIcon={<CirclePlus />} color="naranja">Crear Plan</Button>
                        </Center>
                    </form>
                </Flex>
                <Flex direction="column" align="flex-start" justify="flex-start" w="50%" maw='40vw' >
                    <Tabla headers={headers} smallSize content={planes} colors="tabla-naranja" />
                </Flex>
            </Group>
        </div>
    );
};

export default RegistroPlanes;