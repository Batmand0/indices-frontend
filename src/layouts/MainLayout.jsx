import { LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { setUser } from '../utils/auth';
import { Navigate, Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import NavBar from 'src/components/navbar';

const MainLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      setLoading(true);
      await setUser();
      setLoading(false);
    };
    handler();
  }, []);

  if (!isLoggedIn()) {
    return <Navigate replace to="/iniciar-sesion" />;
  }

  return (
  <>
    <NavBar />
    <LoadingOverlay visible={loading} />
    <Outlet />
    <Footer />
  </>
    );
};

export default MainLayout;
