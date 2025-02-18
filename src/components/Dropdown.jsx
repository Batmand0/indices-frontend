
import { Select } from "@mantine/core";
import { PropTypes } from 'prop-types';
import { Selector } from "tabler-icons-react";

function Dropdown ({label, color, data, handleChangeFn}) {
    return(
        <Select
            searchable
            onChange={handleChangeFn}
            name={label}
            label={label}
            placeholder={label}
            data={data}
            rightSection={
                <Selector color={'#FFF'}/>
            }
            id={label}
            styles={(theme) => ({
                input: {
                    '&:focus-within': {
                        backgroundColor: theme.white,
                        borderColor: color,
                        color: theme.black,
                        fontWeight: "400",
                    },
                    '&::placeholder': {
                        color: theme.white,
                    },
                    backgroundColor: color,
                    color: theme.white,
                    borderRadius: "md",
                    fontWeight: "bold",
                },
                dropdown: {
                    option: {
                        backgroundColor: color,
                    },
                },
                required: {
                    color: color,
                },
                item: {
                    '&[data-selected="true"]':{
                        backgroundColor: color,
                        fontWeight: "bold",
                    },
                    '&[data-selected="true"]:hover':{
                        backgroundColor: color,
                        fontWeight: "bold",
                    },
                },
                rightSection: {
                    pointerEvents: 'none',
                },
                label: {
                    visibility: "hidden",
                    fontWeight: "bold",
                },
                '&::placeholder': {
                    color: theme.white,
                },
                root: {
                    color: theme.white,
                    '&:focus-within': {
                        label: {
                            visibility: "visible",
                        }
                    }
                }
            })}

        />
    );
};
Dropdown.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string,
    data: PropTypes.array,
    handleChangeFn: PropTypes.func,
};
export default Dropdown;