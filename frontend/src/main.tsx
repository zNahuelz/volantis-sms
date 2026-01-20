import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/authContext';
import './index.css';
import './utils/chart';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router}></RouterProvider>
  </AuthProvider>
);
