import { Button, Group, Modal } from "@mantine/core";
import { Logout } from "tabler-icons-react";
import { PropTypes } from 'prop-types';
import { logout } from "../../utils/auth";
import { useNavigate } from 'react-router-dom';


const ModalLogout = ({opened, close}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/iniciar-sesion');
      };

    return (
        <Modal.Root opened={opened} close={close}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title><b>Cerrar Sesión</b></Modal.Title>
                    <Modal.CloseButton onClick={close} bg="gris" color="negro"/>
                </Modal.Header>
                <Modal.Body>
                    ¿Estas seguro de que deseas cerrar sesión? Todos los cambios no guardados serán descartados.
                    <Group position="center" mt={16}>
                        <Button leftIcon={<Logout />} onClick={handleLogout} color="toronja">Cerrar Sesión</Button>
                        <Button color="gris" onClick={close}>Cancelar</Button>
                    </Group>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
};

ModalLogout.propTypes = {
    opened: PropTypes.bool,
    close: PropTypes.func
};
export default ModalLogout;