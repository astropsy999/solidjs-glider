import { Route, Routes } from '@solidjs/router';
import { Component } from 'solid-js';
import HomeScreen from '../components/screens/Home';
import { lazy } from 'solid-js';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProfileScreen from '../components/screens/Profile';
import GlideDetailScreen from '../components/screens/GlideDetail';
const LoginScreen = lazy(() => import('../components/screens/Login'));
const RegisterScreen = lazy(() => import('../components/screens/Register'));

const AppRoutes: Component<{}> = (props) => {
  return (
    <Routes>
      <Route path={'/'} component={MainLayout}>
        <Route path={'/'} component={HomeScreen} />
        <Route path={'/:uid/glide/:id'} component={GlideDetailScreen} />
        <Route path={'profile'} component={ProfileScreen} />
      </Route>
      <Route path={'/auth'} component={AuthLayout}>
        <Route path={'/login'} component={LoginScreen} />
        <Route path={'/register'} component={RegisterScreen} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
