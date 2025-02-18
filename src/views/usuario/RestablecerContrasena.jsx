import { Button, Container, Flex, Group, PasswordInput, Popover, Progress, Text, createStyles } from "@mantine/core";
import Header from "src/components/header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { sendNewPassword } from "src/routes/api/controllers/restablecerController";
import PasswordStrengthMeter from "src/components/PasswordStrengthMeter";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { CircleX } from "tabler-icons-react";

const requirements = [
    { re: /[0-9]/, label: 'Incluye 1 número' },
    { re: /[a-z]/, label: 'Includes 1 letra minúscula' },
    { re: /[A-Z]/, label: 'Includes 1 letra mayúscula' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Incluye caracter especial' },
    ];

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
function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;
    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
        multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}
const RestablecerContrasena = () => {
    const navigate = useNavigate();
    const { classes} = useStyles();
    const [popoverOpened, setPopoverOpened] = useState(false);
    const { t } = useParams();
    const form = useForm({
        initialValues: {
            password: '',
            copyPassword: '',
            token: t
        },
        validate: {
            password: ((value) => value.length < 8 ? 'La contraseña es demasiado corta': null),
            copyPassword: ((value, values) => value !== values.password ? 'Las contraseñas deben ser iguales' : null),
        }
    });
    const strength = getStrength(form.getInputProps('password').value);
    const checks = requirements.map((requirement, index) => (
        <PasswordStrengthMeter key={index} label={requirement.label} meets={requirement.re.test(form.getInputProps('password').value)} />
    ));

    const sendPassword = async (values) => {
        if (form.validate() && strength === 100) {
            const res = await sendNewPassword(t, values.password);
            if (res.status === 200) {
                navigate('/iniciar-sesion');
            } else {
                notifications.show({
                    message: 'Lo sentimos, ocurrio un problema y no se pudo cambiar su contraseña.',
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
            <Header color="naranja" route="/iniciar-sesion" section="Usuario" title="Restablecimiento de contraseña" />
            <Group  align="center" justify="center" mt={20} spacing="xl" >
                <Flex direction="column" align="center">
                <Text>En seguida podrás restablecer tu contraseña del sistema, recuerda que debe tener 8 caracteres como mínimo, 1 número, 1 caracter especial, 1 letra minúscula y 1 letra mayúscula.</Text>
                    <form onSubmit={form.onSubmit(sendPassword)}>
                        <Group w='25vw' align="center" justify="center">
                        <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
                            <Popover.Target>
                                <div style={{ width: '100%'}} onFocusCapture={() => setPopoverOpened(true)} onBlurCapture={() => setPopoverOpened(false)} >
                                    <PasswordInput  {...form.getInputProps('password')} classNames={{ input: classes.orangeInput, required: classes.orangeAsterisk}} w="100%" label="Contraseña nueva" withAsterisk />
                                </div>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Progress color='teal' value={strength} size={5} mb="xs" />
                                <PasswordStrengthMeter label="Incluir al menos 8 caracteres" meets={form.getInputProps('password').value.length > 7} />
                                {checks}
                            </Popover.Dropdown>
                        </Popover>
                        <PasswordInput width={300} maw='100%' {...form.getInputProps('copyPassword')} classNames={{ input: classes.orangeInput, required: classes.orangeAsterisk}} w="100%" label="Repita la contraseña nueva" withAsterisk />
                        <Button m='10px auto' disabled={!(strength === 100)} color="naranja" type="submit">Cambiar contraseña</Button>
                        </Group>
                    </form>
                </Flex>
            </Group>
        </Container>
    );
};

export default RestablecerContrasena;