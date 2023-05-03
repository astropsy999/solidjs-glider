import { Outlet, useNavigate } from '@solidjs/router';
import { Component, onMount } from 'solid-js';
import { useAuthState } from '../../components/context/auth';
import PersistenceProvider from '../../components/context/persistence';

const MainLayout: Component<{}> = (props) => {
  const authState = useAuthState()!;
  const navigate = useNavigate();

  onMount(() => {
    if (!authState.isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  });

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <PersistenceProvider>
      <Outlet />
    </PersistenceProvider>
  );
};

export default MainLayout;
