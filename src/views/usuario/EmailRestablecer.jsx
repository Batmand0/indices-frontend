import { Button, Center, Container, Flex, Group, Text, TextInput, createStyles } from "@mantine/core";
import Header from "src/components/header";
import { sendPasswordResetEmail } from "src/routes/api/controllers/restablecerController";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { CircleX, ShieldCheck } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
    orangeInput: {
        '&:focus-within':{
            borderColor: '#FFAA5A',
        }
    },
    orangeAsterisk: {
        color: '#FFAA5A',
    }
}));
const EmailRestablecer = () => {
    const { classes} = useStyles();
    const form = useForm({
        initialValues: {
            email: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'El email no es válido'),
        }
    });

    const sendEmail = async (values) => {
        if (form.validate()) {
            const res = await sendPasswordResetEmail(values.email);
            console.log(res.status);
            if (res.status === 200) {
                notifications.show({
                    message: 'Se ha enviado un mensaje a la dirección de correo electrónico que ingreso, revise su bandeja de entrada y siga las instrucciones del correo.',
                    color: 'teal',
                    icon: <ShieldCheck />,
                  });
            } else {
                notifications.show({
                    message: 'Lo sentimos, el correo que ingreso no corresponde a ningun usuario.',
                    color: 'red',
                    icon: <CircleX />,
                  });
            }
        }
    };
    return(
        <Container style={{
            display: 'flex',
            flexDirection: 'column',
            align: "center",
            justifyContent: "center",
            padding: "2vw"
        }}>
            <Header color="naranja" route="/" section="Usuario" title="Restablecimiento de contraseña" />
            <Group  align="center" justify="center" mt={20} spacing="xl" >
                <Flex direction="column" align="center">
                <Text>Ingresa el correo electrónico asociado a su cuenta, enseguida le enviaremos las instrucciones para restablecer su contraseña.</Text>
                    <form onSubmit={form.onSubmit(sendEmail)}>
                        <Group w='25vw' align="center" justify="center">
                            <TextInput {...form.getInputProps('email')} classNames={{ input: classes.orangeInput, required: classes.orangeAsterisk}} w="100%" label="Correo electrónico" withAsterisk />
                        </Group>
                        <Center>
                            <Button mt={10} color="naranja" type="submit">Cambiar contraseña</Button>
                        </Center>
                    </form>
                </Flex>
            </Group>
        </Container>
    );
};

export default EmailRestablecer;