import {
    ActionIcon,
    Group,
    Text,
    Image
} from "@mantine/core";
import { PropTypes } from 'prop-types';
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "tabler-icons-react";
import './BoxOption.css';

function BoxOption({color, label, route, icon, description}) {
    const navigate = useNavigate();
    return (
        <Group
            className="box-option"
            onClick={() => navigate(route)}
        >
            {icon && (
                <Image 
                    src={`/img/${icon}`}
                    alt={label}
                    width={24}
                    height={24}
                    className="box-option-icon"
                />
            )}
            <div>
                <Text fw={600} className="box-option-text">{ label }</Text>
                {description && (
                    <Text size="sm" color="dimmed" mt={5}>
                        { description }
                    </Text>
                )}
            </div>
            <ActionIcon 
                color={color} 
                radius="xl" 
                variant="filled"
                className="box-option-arrow"
            >
                <ChevronRight color="white" />
            </ActionIcon>
        </Group>
    );
};

BoxOption.propTypes = {
    color: PropTypes.string,
    label: PropTypes.string,
    route: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string
};
export default BoxOption;