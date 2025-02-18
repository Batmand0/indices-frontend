import {
    ActionIcon,
    Group,
    Text
} from "@mantine/core";
import { PropTypes } from 'prop-types';
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "tabler-icons-react";


function BoxOption({color, label, route}) {
    const navigate = useNavigate();
    return (
        <Group
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                backgroundColor: "#F0F0F0",
                padding: '15px 10px',
                minWidth: "250px",
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: '10px',
            }}
        >
            <Text fw={600} >{ label }</Text>
            <ActionIcon color={color} radius="xl" variant="filled" onClick={() => {
                navigate(route);
            }}>
                <ChevronRight color="white" />
            </ActionIcon>
        </Group>
    );
};

BoxOption.propTypes = {
    color: PropTypes.string,
    label: PropTypes.string,
    route: PropTypes.string,
};
export default BoxOption;