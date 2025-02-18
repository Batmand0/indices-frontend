import { MantineProvider } from "@mantine/core";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Notifications } from '@mantine/notifications';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from 'src/layouts/MainLayout';
import indicesTheme from "src/CustomProvider";

import Login from 'src/views/Login';
import Inicio from 'src/views/Inicio';
import MiPerfil from "src/views/usuario/MiPerfil";

import SubirArchivos from "src/views/SubirArchivos";

import RegistroCarreras from 'src/views/registros/Carreras';
import RegistroPlanes from 'src/views/registros/Planes';
import RegistroDiscapacidades from 'src/views/registros/Discapacidades';
import IndicePermanencia from 'src/views/indices/Permanencia';
import IndiceEgreso from 'src/views/indices/Egreso';
import IndiceDesercion from 'src/views/indices/Desercion';
import IndiceTitulacion from 'src/views/indices/Titulacion';
import TablaPoblacion from "src/views/tablas/Poblacion";
import TablaCrecimiento from 'src/views/tablas/Crecimiento';
import SeleccionIndices from "src/views/indices/Seleccion";
import SeleccionTablas from 'src/views/tablas/Seleccion';
import SeleccionRegistros from "src/views/registros/Seleccion";
import CedulaCacei from "src/views/cedulas/Cacei";
import AlumnosLista from "src/views/alumnos/AlumnosLista";
import AlumnosHistorial from "src/views/alumnos/AlumnosHistorial";
import CedulaCaceca from "src/views/cedulas/Caceca";

import UsuariosLista from "src/views/UsuariosLista";

import CambioContrasena from "src/views/usuario/CambioContrasena";
import SeleccionAlumnos from "src/views/alumnos/Seleccion";
import SeleccionCedulas from "src/views/cedulas/Seleccion";
import Error404 from "src/views/errores/Error404";
import Error500 from "src/views/errores/Error500";
import SeleccionReportes from "src/views/reportes/Seleccion";
import ReportesTitulacion from "src/views/reportes/Titulacion";
import ReportesEgreso from "src/views/reportes/Egreso";
import ReportesNuevoIngreso from "src/views/reportes/NuevoIngreso";
import RestablecerContrasena from "src/views/usuario/RestablecerContrasena";
import EmailRestablecer from "src/views/usuario/EmailRestablecer";
import CrearUsuario from "./views/usuario/CrearUsuario";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Inicio />,
      },
      {
        path: '/mi-perfil',
        element: <MiPerfil />,
      },
      {
        path: '/cambio-contrasena',
        element: <CambioContrasena />,
      },
      {
        path: '/subir-archivos',
        element: <SubirArchivos />,
      },
      {
        path: '/registro',
        element: <SeleccionRegistros />,
      },
      {
        path: '/registro/carrera',
        element: <RegistroCarreras />
      },
      {
        path: '/registro/planes',
        element: <RegistroPlanes />
      },
      {
        path: '/registro/discapacidades',
        element: <RegistroDiscapacidades />
      },
      {
        path: '/indices',
        element: <SeleccionIndices />,
      },
      {
        path: '/indices/permanencia',
        element: <IndicePermanencia />,
      },
      {
        path: '/indices/egreso',
        element: <IndiceEgreso />,
      },
      {
        path: '/indices/desercion',
        element: <IndiceDesercion />,
      },
      {
        path: '/indices/titulacion',
        element: <IndiceTitulacion />,
      },
      {
        path: '/tablas',
        element: <SeleccionTablas />,
      },
      {
        path: '/tablas/poblacion',
        element: <TablaPoblacion />,
      },
      {
        path: '/tablas/crecimiento',
        element: <TablaCrecimiento />,
      },
      {
        path: '/alumnos',
        element: <SeleccionAlumnos />,
      },
      {
        path: '/alumnos/lista',
        element: <AlumnosLista />,
      },
      {
        path: '/alumnos/historial/:control?',
        element: <AlumnosHistorial />,
      },
      {
        path: '/cedulas',
        element: <SeleccionCedulas />,
      },
      {
        path: '/cedulas/cacei',
        element: <CedulaCacei />,
      },
      {
        path: '/cedulas/caceca',
        element: <CedulaCaceca />,
      },
      {
        path: '/reportes',
        element: <SeleccionReportes />,
      },
      {
        path: '/reportes/titulacion',
        element: <ReportesTitulacion />,
      },
      {
        path: '/reportes/egreso',
        element: <ReportesEgreso />,
      },
      {
        path: '/reportes/nuevo-ingreso',
        element: <ReportesNuevoIngreso />,
      },
      {
        path: '/usuarios/lista',
        element: <UsuariosLista />,
      },
      {
        path: '/usuarios/crear',
        element: <CrearUsuario />,
      },
      {
        path: '/500',
        element: <Error500 />,
      },
      {
        path: '*',
        element: <Error404 />,
      }
    ]
  },
  {
    path: '/iniciar-sesion',
    element: <Login />,
  },
  {
    path: '/restablecer-contrasena/:t',
    element: <RestablecerContrasena />,
  },
  {
    path: '/restablecer-contrasena/email',
    element: <EmailRestablecer />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Notifications />
      <MantineProvider theme={indicesTheme} withGlobalStyles withNormalizeCSS>
        <RouterProvider router={router} />
      </MantineProvider>
  </React.StrictMode>
);
