import {
    Accordion,
    Group,
    Modal,
    List,
    Button,
    Text
} from "@mantine/core";
import { CircleX, CircleCheck, AlertTriangle, DiscountCheck } from "tabler-icons-react";
import { PropTypes } from 'prop-types';


function ResultadosLog ({opened, close, info}) {

    return (
        <Modal.Root opened={opened} onClose={close} centered closeOnClickOutside={false}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title  fw="bold">Resultados</Modal.Title>
                    <Modal.CloseButton bg="gris" color="negro"></Modal.CloseButton>
                </Modal.Header>
                <Modal.Body>
                    <Accordion>
                        <Accordion.Item value="errores">
                            <Accordion.Control icon={<CircleX  color="#ED4333" strokeWidth={3}/>}>
                                <Group>
                                    <Text fw='bold'>Errores</Text>
                                    <Text size='xs'>({info.errors.length})</Text>
                                </Group>
                                </Accordion.Control>
                            <Accordion.Panel>
                                <List>
                                { info.errors.length > 0 ? info.errors.map((err, i) => <List.Item key={i}>{info.errors[i].row_index}: {info.errors[i].message}</List.Item> )  : <List.Item>No hubo ningún error</List.Item> }
                                    {/* { info.errors?.length > 0 ? info.erors.map( (error, index) => <List.Item key={index}>{error.message}</List.Item>) : <List.Item>No hubo ningún error</List.Item> } */}
                                </List>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="advertencias">
                            <Accordion.Control icon={<AlertTriangle  color="#FFD25A" strokeWidth={3}/>}>
                            <Group>
                                <Text fw='bold'>Advertencias</Text>
                                <Text size='xs'>(0)</Text>
                            </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <List>
                                    <List.Item>No hay ninguna advertencia</List.Item>
                                </List>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="guardados">
                            <Accordion.Control icon={<DiscountCheck  color="#80ED99" strokeWidth={3}/>}>
                            <Group>
                                <Text fw='bold'>Guardados</Text>
                                <Text size='xs'>({info.created})</Text>
                            </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <List>
                                    <List.Item >Se crearon {info.created} registros</List.Item>
                                </List>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                    <Group position='center' align="center" mt={16}>
                        <Button leftIcon={<CircleCheck />} color="verde" onClick={close}>Continuar</Button>
                        <Button color="gris" onClick={close}>Cancelar</Button>
                    </Group>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}

ResultadosLog.propTypes = {
    opened: PropTypes.bool,
    info: PropTypes.object,
    close: PropTypes.func,
};

export default ResultadosLog;