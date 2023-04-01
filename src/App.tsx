import { Component } from 'solid-js';
import AppRoutes from './router';

const App: Component = () => {
  return (
    <>
    <div id="popup"></div>
      <AppRoutes />
    </>
  );
};

export default App;
