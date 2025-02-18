import { Button, Group, Modal } from "@mantine/core";
import { Logout, MessageCircle, X } from "tabler-icons-react";
import { PropTypes } from 'prop-types';
import { realizarCorte } from "src/routes/api/controllers/registroController";
import { notifications } from "@mantine/notifications";


const ModalCorte = ({opened, close}) => {
    const handleCorte = async() => {
        const res = await realizarCorte();
        console.log(res);
        if (res.status === 200){
            notifications.show({
                message: 'Enhorabuena, se ha realizado el corte de manera exitosa',
                color: 'teal',
                icon: <MessageCircle />,
            });
            close();
        } else {
            notifications.show({
                message: 'Lo sentimos, no se pudo realizar el corte',
                color: 'red',
                icon: <X />,
            });
        }
      };

    return (
        <Modal.Root opened={opened} close={close}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title><b>Realizar corte</b></Modal.Title>
                    <Modal.CloseButton onClick={close} bg="gris" color="negro"/>
                </Modal.Header>
                <Modal.Body>
                    ¿Esta seguro de que desea realizar corte? No se podran realizar cambios a los datos de los alumnos después de esto.
                    <Group position="center" mt={16}>
                        <Button leftIcon={<Logout />} onClick={handleCorte} color="toronja">Realizar Corte</Button>
                        <Button color="gris" onClick={close}>Cancelar</Button>
                    </Group>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
};

ModalCorte.propTypes = {
    opened: PropTypes.bool,
    close: PropTypes.func
};
export default ModalCorte;