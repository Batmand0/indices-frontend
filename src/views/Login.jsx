import "./Login.css";
import {
  Box,
  Title,
  Button,
  TextInput,
  PasswordInput,
  LoadingOverlay,
  Center,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { MdError } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useAuthStore } from "src/store/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { login } from "src/utils/auth";

const Login = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  });

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async (values) => {
    setLoading(true);
    console.log(import.meta.env.VITE_BACKEND_URL);
    const { error } = await login(values.username, values.password);
    if (error) {
      notifications.show({
        message: error,
        color: 'red',
        icon: <MdError />,
      });
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return  (
      <div className='login'>
        <img src="/img/patternpad.svg" alt="Patron de figuras" />
        <div>
          <img src="/img/logo/itmlogo.png" alt="Logo del ITM" className="logo"/>
          <Title order={1} ta={ "center" }>Iniciar sesión</Title>
          <Box>
            <LoadingOverlay visible={loading} />
              <form onSubmit={form.onSubmit(handleLogin)}>
                <TextInput
                  label="Nombre de Usuario o Correo Electrónico"
                  w={300}
                  required
                  {...form.getInputProps('username')}
                />
                <PasswordInput
                  label="Contraseña"
                  required
                  {...form.getInputProps('password')}
                />
                <Center mx={ "auto" }>
                  <Button type="submit" radius="lg" w={300} mt={ 16 } >Iniciar sesión</Button>
                </Center>
                <Center>
                  <Link to='/restablecer-contrasena/email'>¿Olvidaste tu contraseña?</Link>
                </Center>
              </form>
          </Box>
        </div>
      </div>
  );
};

export default Login;
