import { Flex, Text, Title } from "@mantine/core";

const Error404 = () => {
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Flex align="center" justify="center" direction="column" gap={10}>
                <Title ta="center" order={1} color="toronja" fw="bold">Pagina no encontrada</Title>
                <Text ta="center" fw="bold">Lo sentimos, la página que esta buscando no existe.</Text>
                <img src="/img/404.svg" alt="Error 404" style={{
                    width: "35vw",
                    maxWidth: "500px",
                    }}></img>
            </Flex>
        </div>
    );
};

export default Error404;