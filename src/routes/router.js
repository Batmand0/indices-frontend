import { createBrowserRouter } from 'react-router-dom';
import Inicio from 'src/views/Inicio';
import Login from 'src/views/Login';
import MiPerfil from 'src/views/MiPerfil';
import SubirArchivos from 'src/views/SubirArchivos';
// import RegistroCarreras from './../views/RegCarreras';

const router = createBrowserRouter([
    {
        path: '/',
        element: Inicio,
    },
    {
        path: 'iniciar-sesion',
        element: Login,
    },
    {
        path: '/subir-archivos',
        element: SubirArchivos,
    },
    {
        path: '/mi-perfil',
        element: MiPerfil,
    },

]);

export default router;
