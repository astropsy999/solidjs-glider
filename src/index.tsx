import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import App from './App';

import AuthProvider from './components/context/auth';
import './index.css';
import UIProvider from './components/context/ui';

render(
  () => (
    <Router>
      <UIProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </UIProvider>
    </Router>
  ),
  document.getElementById('root')!,
);
