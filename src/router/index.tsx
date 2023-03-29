import { Route, Routes } from '@solidjs/router';
import { Component } from 'solid-js';
import HomeScreen from '../components/screens/Home';
import { lazy } from 'solid-js';
const LoginScreen = lazy(() => import('../components/screens/Login'));
const RegisterScreen = lazy(() => import('../components/screens/Register'));

const AppRoutes: Component<{}> = (props) => {
  return (
    <Routes>
      <Route path={'/'} component={HomeScreen} />
      <Route path={'/login'} component={LoginScreen} />
      <Route path={'/register'} component={RegisterScreen} />
    </Routes>
  );
};

export default AppRoutes;
