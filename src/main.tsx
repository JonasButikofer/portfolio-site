import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const root = createRoot(document.getElementById('root')!);

// import.meta.env.DEV is statically known at build time, so this branch —
// and the admin page it dynamically imports — is dead-code-eliminated from
// the production bundle entirely. It only exists under `npm run dev`.
if (import.meta.env.DEV && window.location.pathname === '/admin') {
  import('./admin/AdminPage.tsx').then(({ AdminPage }) => {
    root.render(
      <StrictMode>
        <AdminPage />
      </StrictMode>,
    );
  });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
