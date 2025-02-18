import {
    ActionIcon,
    Flex,
    Title
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "tabler-icons-react";
import { PropTypes } from 'prop-types';

function Header ({color, route, section, title}) {
    const navigate = useNavigate();
    const handleRoute = () => {
        navigate(route);
    };

    return(
        <Flex direction="column">
            <ActionIcon onClick={handleRoute} color={color} radius="xl" variant="filled" mb={10} >
                <ArrowLeft />
            </ActionIcon>
            <Title order={3} className={color}><span >{section}</span> {title}</Title>
        </Flex>
    );
}

Header.propTypes = {
    color : PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default Header;