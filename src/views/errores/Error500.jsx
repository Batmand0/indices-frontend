import { Flex, Text, Title } from "@mantine/core";

const Error500 = () => {
    return(
        <div style={{
            width: '100vw',
            padding: '3vw',
        }}>
            <Flex align="center" justify="center" direction="column" gap={10}>
                <Title ta="center" order={1} color="mango" fw="bold">Internal Server Error</Title>
                <Text ta="center" fw="bold">Lo sentimos, nuestro servidor tuvo un error y no pudo completar la peticion.</Text>
                <img src="/img/error500.svg" alt="Error 500" style={{
                    width: "35vw",
                    maxWidth: "500px",
                    }}></img>
            </Flex>
        </div>
    );
};

export default Error500;