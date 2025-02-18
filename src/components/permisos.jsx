import { Accordion, Checkbox, List } from "@mantine/core";

const Permisos = () => {
    const permisos = {
        "Tablas": ["Población", "Crecimiento"],
        "Indices": ["Permanencia", "Egreso", "Titulación", "Deserción"],
        "Reportes": ["Nuevo Ingreso", "Egresados", "Titulados"],
        "Cedulas": ["CACEI", "CACECA"],
    };
    return (
        <Accordion variant="contained" radius="md"  >
            <Accordion.Item value="tablas" w="300px">
                <Accordion.Control><b>Tablas</b></Accordion.Control>
                <Accordion.Panel>
                    <List withPadding listStyleType="none">
                        { permisos.Tablas.map( (permiso,index) => <List.Item key={index}><Checkbox radius="sm"  color="toronja" labelPosition="right" label={permiso} /></List.Item> )}
                    </List>
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="indices" w="300px">
                <Accordion.Control><b>Indices</b></Accordion.Control>
                <Accordion.Panel>
                <List withPadding listStyleType="none">
                        { permisos.Indices.map( (permiso,index) => <List.Item key={index}><Checkbox radius="sm"  color="toronja" labelPosition="right" label={permiso} /></List.Item> )}
                    </List>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="reportes" w="300px">
                <Accordion.Control><b>Reportes</b></Accordion.Control>
                <Accordion.Panel>
                <List withPadding listStyleType="none">
                        { permisos.Reportes.map( (permiso, index) => <List.Item key={index}><Checkbox radius="sm"  color="toronja" labelPosition="right" label={permiso} /></List.Item> )}
                    </List>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="cedulas" w="300px">
                <Accordion.Control><b>Cédulas</b></Accordion.Control>
                <Accordion.Panel>
                <List withPadding listStyleType="none">
                        { permisos.Cedulas.map( (permiso, index) => <List.Item key={index}><Checkbox radius="sm"  color="toronja" labelPosition="right" label={permiso} /></List.Item> )}
                    </List>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};

export default Permisos;