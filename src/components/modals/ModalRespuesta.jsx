import {
    Flex,
    Modal,
} from "@mantine/core";
import { CircleX, CircleCheck } from "tabler-icons-react";
import { PropTypes } from 'prop-types';


function ModalRespuesta ({opened, close, success}) {

    return (
        <Modal.Root opened={opened} onClose={close} centered >
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title  fw="bold">{ success ? "Cambio exitoso" : "Error"}</Modal.Title>
                    {/* <Modal.CloseButton bg="gris" color="negro"></Modal.CloseButton> */}
                </Modal.Header>
                <Modal.Body>
                    <Flex direction="column" justify="center" align="center">
                        {success ? <CircleCheck size={60} color="#80ED99"/> : <CircleX size={60} color="#ED4333"/>}
                        <p>{success ? "Enhorabuena, se han guardado exitosamente los cambios.": "Lo sentimos, no se pudieron guardar los cambios."}</p>
                    </Flex>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}

ModalRespuesta.propTypes = {
    opened: PropTypes.bool,
    close: PropTypes.func,
    success: PropTypes.bool,
};

export default ModalRespuesta;